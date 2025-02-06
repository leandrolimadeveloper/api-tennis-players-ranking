import { Body, Controller, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { ValidateParametersPipe } from 'src/common/pipes/validate-parameters.pipe'

import { ChallengesService } from './challenges.service'
import { CreateChallengeDto } from './dtos/create-challenge.dto'
import { UpdateChallengeDto } from './dtos/update-challenge.dto'
import { Challenge, Match } from './interfaces/challenge.interface'
import { LinkChallengeMatchDto } from './matches/dto/link-challenge-match.dto'

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

    @Get(':id')
    async getChallenge(
        @Param('id', ValidateParametersPipe) id: string
    ): Promise<Challenge> {
        return await this.challengesService.getChallenge(id)
    }

    @Get()
    async getChallenges(): Promise<Challenge[]> {
        return await this.challengesService.getChallenges()
    }

    @Get('players/:playerId')
    async getChallengeByPlayerId(
        @Param('playerId', ValidateParametersPipe) playerId: string
    ): Promise<Challenge[]> {
        return await this.challengesService.getChallengeByPlayerId(playerId)
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    async updateChallenge(
        @Body() updateChallengeDto: UpdateChallengeDto,
        @Param('id', ValidateParametersPipe) id: string
    ): Promise<void> {
        return await this.challengesService.updateChallenge(id, updateChallengeDto)
    }

    @Patch(':id')
    async changeStatusToCancel(
        @Param('id', ValidateParametersPipe) id: string
    ): Promise<void> {
        return await this.challengesService.changeStatusToCancel(id)
    }

    @Post(':id')
    async assignMatchToChallenge(
        @Body() linkChallengeMatchDto: LinkChallengeMatchDto,
        @Param('id', ValidateParametersPipe) id: string
    ): Promise<Match> {
        return await this.challengesService.assignMatchToChallenge(id, linkChallengeMatchDto)
    }

    @Get('/matches')
    async getMatches(): Promise<Match[]> {
        return await this.getMatches()
    }
}
