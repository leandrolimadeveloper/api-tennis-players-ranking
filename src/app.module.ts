import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { CategoriesModule } from './categories/categories.module'
import { PlayersModule } from './players/players.module'
import { ChallengesModule } from './challenges/challenges.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        PlayersModule,
        CategoriesModule,
        ChallengesModule
    ]
})
export class AppModule { }
