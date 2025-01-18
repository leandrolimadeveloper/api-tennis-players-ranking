import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { CreatePlayerDto } from './dtos/create-player.dto'
import { PlayersService } from './players.service'

@Controller('players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) { }

    @Get()
    async getAllPlayers() {
        return await this.playersService.getAllPlayers()
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto
    ) {

        await this.playersService.createPlayer(createPlayerDto)
    }
}
