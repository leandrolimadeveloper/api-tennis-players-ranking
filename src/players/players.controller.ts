import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'

import { CreatePlayerDto } from './dtos/create-player.dto'
import { UpdatePlayerDto } from './dtos/update-player.dto'
import { PlayersService } from './players.service'

@Controller('players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) { }

    @Get()
    async getAllPlayers() {
        return await this.playersService.getAllPlayers()
    }

    @Patch(':id')
    async updatePlayerByEmail(
        @Param('id') id: string,
        @Body() updatePlayerDto: UpdatePlayerDto
    ) {

        const player = await this.playersService.updatePlayerNameById(id, updatePlayerDto)

        return {
            message: 'Player updated successfully',
            player
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto
    ) {

        await this.playersService.createPlayer(createPlayerDto)
    }
}
