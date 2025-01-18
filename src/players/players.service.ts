import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { v4 as uuidV4 } from 'uuid'

import { CreatePlayerDto } from './dtos/create-player.dto'
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

    private create(createPlayerDto: CreatePlayerDto): void {
        const { name, email, phoneNumber } = createPlayerDto

        const player: Player = {
            _id: uuidV4(),
            name,
            email,
            phoneNumber,
            ranking: 'A',
            rankingPosition: 1,
            playerPhotoUrl: 'www.google.com.br/'
        }

        this.players.push(player)
    }
}
