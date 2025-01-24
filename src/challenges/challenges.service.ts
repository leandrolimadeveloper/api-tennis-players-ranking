import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayersService } from 'src/players/players.service'

import { CreateChallengeDto } from './dtos/create-challenge.dto'
import { Challenge } from './interfaces/challenge.interface'

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

        console.log('requester', requester)

        if (!requester) {
            throw new NotFoundException('Player does not exist in the database')
        }

        const playerToBeRequested = await this.playersService.getPlayer((String(createChallengeDto.players[1]._id)))

        console.log('playerToBeRequested', playerToBeRequested)

        if (requester === playerToBeRequested) {
            throw new BadRequestException('Player requester must be different of player required to a match')
        }

        console.log('createChallengeDto.players', createChallengeDto.players)

        // 2. Check if players are present in some category
        const arePlayersInCategories = await this.categoriesService.arePlayersInCategories(createChallengeDto.players)

        if (!arePlayersInCategories) {
            throw new BadRequestException('Players must be registered in some category')
        }

        const createdChallenge = new this.challengeModel(createChallengeDto)
        return await createdChallenge.save()
    }

    async getChallenges(): Promise<Challenge[]> {
        return await this.challengeModel.find().exec()
    }
}