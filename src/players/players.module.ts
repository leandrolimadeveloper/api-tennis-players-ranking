import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PlayerSchema } from './interfaces/player.schema'
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'
import { PlayerRepository } from './repositories/player.repository'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }])],
    controllers: [PlayersController],
    providers: [PlayersService, PlayerRepository],
    exports: [PlayersService]
})
export class PlayersModule { }
