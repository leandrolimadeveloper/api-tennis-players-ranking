import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { CreatePlayerDto } from './dtos/create-player.dto'
import { UpdatePlayerDto } from './dtos/update-player.dto'
import { Player } from './interfaces/player.interface'
import { PlayerRepository } from './repositories/player.repository'

@Injectable()
export class PlayersService {
    constructor(private readonly playersRepository: PlayerRepository) { }

    private readonly logger = new Logger(PlayersService.name)

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const { email, phoneNumber } = createPlayerDto

        const playerEmail = await this.playersRepository.findByEmail(email)

        const playerPhoneNumber = await this.playersRepository.findByPhoneNumber(phoneNumber)

        if (playerEmail) {
            throw new BadRequestException('Player with this email already exists')
        }

        if (playerPhoneNumber) {
            throw new BadRequestException('Player with this phone number already exists')
        }

        this.logger.log(`Create player DTO: ${JSON.stringify(createPlayerDto)}`)

        return await this.playersRepository.create(createPlayerDto)
    }

    async getAllPlayers(): Promise<Player[]> {
        return await this.playersRepository.findAll()
    }

    async getPlayer(id: string): Promise<Player> {
        const player = await this.playersRepository.findById(id)

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        return player
    }

    async updatePlayerById(id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
        const player = await this.playersRepository.findById(id)

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        const updatedPlayer = await this.playersRepository.update(player.id, updatePlayerDto)

        this.logger.log(`Create player DTO: ${(updatedPlayer)}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async deletePlayer(id: string): Promise<any> {
        const player = await this.playersRepository.findById(id)

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        return await this.playersRepository.delete(id)
    }
}
