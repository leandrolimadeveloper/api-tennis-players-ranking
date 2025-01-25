import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ValidateParametersPipe } from 'src/common/pipes/validate-parameters.pipe'

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

    @Get(':id')
    async getChallenge(
        @Param('id', ValidateParametersPipe) id: string
    ): Promise<Challenge> {
        return await this.challengesService.getChallenge(id)
    }
}
