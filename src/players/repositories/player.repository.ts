import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Model } from 'mongoose'

import { Player } from '../interfaces/player.interface'
import { IPlayerRepository } from '../interfaces/player.repository.interface'

@Injectable()
export class PlayerRepository implements IPlayerRepository {
    constructor(
        @InjectModel('Player') private readonly playerModel: Model<Player>
    ) { }

    async findById(id: string): Promise<Player | null> {
        return this.playerModel.findById(id).exec()
    }

    async findByEmail(email: string): Promise<Player | null> {
        return this.playerModel.findOne({ email }).exec()
    }

    async findByPhoneNumber(phoneNumber: string): Promise<Player | null> {
        return this.playerModel.findOne({ phoneNumber }).exec()
    }

    async findAll(): Promise<Player[]> {
        return this.playerModel.find().exec()
    }

    async create(playerData: Partial<Player>): Promise<Player> {
        const player = new this.playerModel(playerData)

        return player.save()
    }

    async update(id: string, playerData: Partial<Player>): Promise<Player | null> {
        return this.playerModel.findByIdAndUpdate(id, playerData, { new: true }).exec()
    }

    async delete(id: string): Promise<void> {
        await this.playerModel.findByIdAndDelete(id).exec()
    }
}