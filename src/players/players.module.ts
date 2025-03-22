import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PlayerSchema } from './interfaces/player.schema'
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'
import { PlayerSeeder } from './seeds/player.seed'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }])],
    controllers: [PlayersController],
    providers: [PlayersService, PlayerSeeder],
    exports: [PlayersService]
})
export class PlayersModule { }
