import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'

import { CreatePlayerDto } from './dtos/create-player.dto'
import { UpdatePlayerDto } from './dtos/update-player.dto'
import { Player } from './interfaces/player.interface'
import { PlayersService } from './players.service'

@Controller('players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) { }

    @Get()
    async getAllPlayers() {
        return await this.playersService.getAllPlayers()
    }

    @Get(':id')
    async getPlayer(
        @Param('id') id: string
    ): Promise<Player> {
        return await this.playersService.getPlayer(id)
    }

    @Patch(':id')
    async updatePlayerById(
        @Param('id') id: string,
        @Body() updatePlayerDto: UpdatePlayerDto
    ) {

        await this.playersService.updatePlayerById(id, updatePlayerDto)

        return {
            message: 'Player updated successfully',
            updatePlayerDto
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto
    ) {

        await this.playersService.createPlayer(createPlayerDto)
    }

    @Delete(':id')
    async deletePlayer(
        @Param('id') id: string
    ): Promise<void> {
        await this.playersService.deletePlayer(id)
    }
}
