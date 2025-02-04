import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayersService } from 'src/players/players.service'

import { CreateChallengeDto } from './dtos/create-challenge.dto'
import { UpdateChallengeDto } from './dtos/update-challenge.dto'
import { Challenge } from './interfaces/challenge.interface'
import { ChallengeStatus } from './interfaces/challenge-status.enum'

@Injectable()
export class ChallengesService {
    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
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
        const challenges = await this.challengeModel.find().populate('players').exec()

        return challenges
    }

    async getChallenge(id: string): Promise<Challenge> {
        const challenge = await (await this.challengeModel.findOne({ _id: id })).populate('players')

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
}