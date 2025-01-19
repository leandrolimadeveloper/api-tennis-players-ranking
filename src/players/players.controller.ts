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

    @Get(':email')
    async getPlayer(
        @Param('email') email: string
    ): Promise<Player> {
        return await this.playersService.getPlayer(email)
    }

    @Patch(':id')
    async updatePlayerNameById(
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

    @Delete(':id')
    async deletePlayer(
        @Param('id') id: string
    ): Promise<void> {
        await this.playersService.deletePlayer(id)
    }
}
