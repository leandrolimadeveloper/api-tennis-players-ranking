import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'

import { ChallengesService } from './challenges.service'
import { CreateChallengeDto } from './dtos/create-challenge.dto'
import { Challenge } from './interfaces/challenge.interface'

@Controller('challenges')
export class ChallengesController {
    constructor(private readonly challengesService: ChallengesService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(
        @Body() createChallengeDto: CreateChallengeDto
    ): Promise<Challenge> {
        return await this.challengesService.createChallenge(createChallengeDto)
    }

    @Get()
    async getChallenges(): Promise<Challenge[]> {
        return await this.challengesService.getChallenges()
    }
}
