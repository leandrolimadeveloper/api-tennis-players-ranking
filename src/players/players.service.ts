import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreatePlayerDto } from './dtos/create-player.dto'
import { UpdatePlayerDto } from './dtos/update-player.dto'
import { Player } from './interfaces/player.interface'

@Injectable()
export class PlayersService {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) { }

    private readonly logger = new Logger(PlayersService.name)

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const { email, phoneNumber } = createPlayerDto

        const playerEmail = await this.playerModel.findOne({ email }).exec()

        const playerPhoneNumber = await this.playerModel.findOne({ phoneNumber }).exec()

        if (playerEmail) {
            throw new BadRequestException('Player with this email already exists')
        }

        if (playerPhoneNumber) {
            throw new BadRequestException('Player with this phone number already exists')
        }

        this.logger.log(`Create player DTO: ${JSON.stringify(createPlayerDto)}`)

        return await this.create(createPlayerDto)
    }

    async getAllPlayers(): Promise<Player[]> {
        return await this.playerModel.find()
            .sort({ createdAt: -1 })
            .exec()
    }

    async getPlayer(id: string): Promise<Player> {
        const player = await this.playerModel.findOne({ _id: id }).exec()

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        return player
    }

    async updatePlayerById(id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
        const player = await this.playerModel.findById({ _id: id })

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        const updatedPlayer = await this.playerModel.findByIdAndUpdate(player.id, updatePlayerDto)

        this.logger.log(`Create player DTO: ${(updatedPlayer)}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async deletePlayer(id: string): Promise<any> {
        const player = await this.playerModel.findOne({ _id: id }).exec()

        if (!player) {
            throw new NotFoundException('Player not found')
        }

        return await this.playerModel.deleteOne({ _id: id }).exec()
    }

    private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const player = new this.playerModel(createPlayerDto)

        return await player.save()
    }
}
