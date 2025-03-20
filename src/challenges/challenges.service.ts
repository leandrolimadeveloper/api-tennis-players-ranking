import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayerResultPoints } from 'src/players/interfaces/player-result-points.enum'
import { PlayersService } from 'src/players/players.service'

import { CreateChallengeDto } from './dtos/create-challenge.dto'
import { UpdateChallengeDto } from './dtos/update-challenge.dto'
import { Challenge, Match } from './interfaces/challenge.interface'
import { ChallengeStatus } from './interfaces/challenge-status.enum'
import { LinkChallengeMatchDto } from './matches/dto/link-challenge-match.dto'

@Injectable()
export class ChallengesService {
    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private readonly playersService: PlayersService,
        private readonly categoriesService: CategoriesService
    ) { }

    async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
        // 1. Check if probable players for the match exist
        const requester = await this.playersService.getPlayer((String(createChallengeDto.requester)))

        if (!requester) {
            throw new NotFoundException('Player does not exist in the database')
        }

        const playerToBeRequested = await this.playersService.getPlayer((String(createChallengeDto.players[1]._id)))

        if (requester._id.toString() === playerToBeRequested._id.toString()) {
            throw new BadRequestException('Requester player cannot be the same as the player being challenged')
        }

        // 2. Check if players are present in some category
        const arePlayersInCategories = await this.categoriesService.arePlayersInCategories(createChallengeDto.players)

        if (!arePlayersInCategories) {
            throw new BadRequestException('Players must be registered in some category')
        }

        // 3. Find the requester's category
        const requesterCategory = await this.categoriesService.findCategoryByPlayer(String(requester._id))

        if (!requesterCategory) {
            throw new NotFoundException('Requester needs to be registered in some category')
        }

        const createdChallenge = new this.challengeModel(createChallengeDto)

        createdChallenge.status = ChallengeStatus.PENDING
        createdChallenge.requestDateTime = new Date()
        createdChallenge.category = requesterCategory.name

        return await createdChallenge.save()
    }

    async getChallenges(): Promise<Challenge[]> {
        const challenges = await this.challengeModel.find()
            .populate('players')
            .sort({ createdAt: -1 })
            .exec()

        return challenges
    }

    async getChallenge(id: string): Promise<Challenge> {
        const challenge = await this.challengeModel.findOne({ _id: id })
            .populate('players')
            .populate('match')

        if (!challenge) {
            throw new NotFoundException('Challenge not found')
        }

        return challenge
    }

    async getChallengeByPlayerId(playerId: string): Promise<Challenge[]> {
        if (!Types.ObjectId.isValid(playerId)) {
            throw new BadRequestException('Invalid player ID')
        }

        const challengesByPlayer = await this.challengeModel.find({ requester: new Types.ObjectId(playerId) }).populate('players')

        if (challengesByPlayer.length === 0) {
            throw new NotFoundException('Challenges for this requester player not found')
        }

        return challengesByPlayer
    }

    async updateChallenge(id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
        const challenge = await this.getChallenge(id)

        if (!challenge) {
            throw new NotFoundException('Challenge not found')
        }

        if (challenge.status === ChallengeStatus.FINISHED) {
            throw new BadRequestException('This match has been finished')
        }

        if (challenge.status === ChallengeStatus.ACCEPTED && updateChallengeDto.status.toUpperCase() !== ChallengeStatus.CANCELED) {
            throw new BadRequestException('Challenge status is already set up as ACCEPTED. The unique change permitted is to cancel the challenge.')
        }

        if (challenge.status === ChallengeStatus.DECLINED && updateChallengeDto.status.toUpperCase() !== ChallengeStatus.CANCELED) {
            throw new BadRequestException('Challenge status is already set up as DECLINED. There is nothing to do.')
        }

        if (challenge.status === ChallengeStatus.ACCEPTED) {
            if (updateChallengeDto.status.toUpperCase() === ChallengeStatus.DECLINED) {
                throw new BadRequestException('It is not possible to change a challenge status to DECLINED if it was already set up to ACCEPTED.')
            }
        }

        if (challenge.status === ChallengeStatus.DECLINED) {
            if (updateChallengeDto.status.toUpperCase() === ChallengeStatus.ACCEPTED) {
                throw new BadRequestException('It is not possible to change a challenge status to ACCEPTED if it was already set up to DECLINED.')
            }
        }

        if (challenge.status === ChallengeStatus.CANCELED) {
            throw new BadRequestException('The challenge status is already set up as CANCELLED. There is nothing to do.')
        }

        await this.challengeModel.findByIdAndUpdate(challenge._id, updateChallengeDto)
    }

    async changeStatusToCancel(id: string) {
        const challenge = await this.getChallenge(id)

        if (!challenge) {
            throw new NotFoundException('Challenge not found')
        }

        if (challenge.status === ChallengeStatus.CANCELED) {
            throw new BadRequestException('Challenge status is already set to CANCELED')
        }

        challenge.status = ChallengeStatus.CANCELED

        await this.challengeModel.findByIdAndUpdate(challenge._id, challenge)
    }

    async assignMatchToChallenge(id: string, linkChallengeMatchDto: LinkChallengeMatchDto): Promise<Match> {
        const challenge = await this.getChallenge(id)

        if (!challenge) {
            throw new NotFoundException('Challenge not found')
        }

        if (challenge.status === ChallengeStatus.FINISHED) {
            throw new BadRequestException('This match has been finished')
        }

        if (challenge.status !== ChallengeStatus.ACCEPTED) {
            throw new BadRequestException('The match needs to have the status as ACCEPT')
        }

        const { winner, loser, result } = linkChallengeMatchDto

        const isWinnerInChallenge = challenge.players.some((player) => player._id.toString() === winner)
        const isLoserInChallenge = challenge.players.some(player => player._id.toString() === loser)

        if (!isWinnerInChallenge) {
            throw new NotFoundException('Player winner is not present in the challenge')
        }

        if (!isLoserInChallenge) {
            throw new NotFoundException('Player defeated is not present in the challenge')
        }

        if (!Array.isArray(result)) {
            throw new BadRequestException('Result must be an array of sets')
        }

        const newMatch = new this.matchModel({
            category: challenge.category,
            players: challenge.players,
            winner,
            loser,
            result
        })

        // Update player score
        const winnerPlayer = newMatch.players.find((player) => player._id.toString() === winner)
        const loserPlayer = newMatch.players.find((player) => player._id.toString() === loser)

        winnerPlayer.score += PlayerResultPoints.MATCH_WINNER
        loserPlayer.score -= PlayerResultPoints.MATCH_LOSER

        await this.playersService.updatePlayerById(String(winnerPlayer._id), winnerPlayer)
        await this.playersService.updatePlayerById(String(loserPlayer._id), loserPlayer)

        await winnerPlayer.save()
        await loserPlayer.save()

        const savedMatch = await newMatch.save()

        // Update challenge with match reference
        challenge.status = ChallengeStatus.FINISHED
        challenge.match = savedMatch._id as Types.ObjectId

        await this.challengeModel.findByIdAndUpdate(challenge._id, challenge)

        return savedMatch
    }

    async getMatches(): Promise<Match[]> {
        return await this.matchModel.find().exec()
    }
}