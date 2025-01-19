import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { v4 as uuidV4 } from 'uuid'

import { CreatePlayerDto } from './dtos/create-player.dto'
import { UpdatePlayerDto } from './dtos/update-player.dto'
import { Player } from './interfaces/player.interface'

@Injectable()
export class PlayersService {
    private players: Player[] = []

    private readonly logger = new Logger(PlayersService.name)

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
        const player = this.players.find(player => player.email === createPlayerDto.email)

        if (player) {
            throw new BadRequestException('Player with this email already exists')
        }

        this.logger.log(`Create player DTO: ${JSON.stringify(createPlayerDto)}`)

        this.create(createPlayerDto)
    }

    async getAllPlayers(): Promise<Player[]> {
        return this.players
    }

    async getPlayer(email: string): Promise<Player> {
        const player = this.players.find(player => player.email === email)

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        return player
    }

    async updatePlayerNameById(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
        const player = this.players.find(player => player._id === id)

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        this.update(player, updatePlayerDto)

        return player
    }

    async deletePlayer(id: string): Promise<void> {
        const player = this.players.find(player => player._id === id)

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        this.players = this.players.filter(player => player._id !== id)
    }

    private create(createPlayerDto: CreatePlayerDto): void {
        const { name, email, phoneNumber } = createPlayerDto

        const player: Player = {
            _id: uuidV4(),
            name,
            email,
            phoneNumber,
            ranking: 'A',
            rankingPosition: this.players.length + 1,
            playerPhotoUrl: 'www.google.com.br/'
        }

        this.players.push(player)
    }

    private update(player: Player, updatePlayerDto: UpdatePlayerDto): void {
        if (updatePlayerDto.name) {
            player.name = updatePlayerDto.name
        }

        this.logger.log(`Player updated: ${JSON.stringify(player)}`)
    }
}
