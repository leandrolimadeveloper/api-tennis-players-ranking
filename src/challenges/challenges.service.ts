import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayersService } from 'src/players/players.service'

import { CreateChallengeDto } from './dtos/create-challenge.dto'
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
        return await this.challengeModel.find().exec()
    }

    async getChallenge(id: string): Promise<Challenge> {
        const challenge = await this.challengeModel.findOne({ _id: id }).exec()

        if (!challenge) {
            throw new NotFoundException('Challenge not found')
        }

        return challenge
    }
}