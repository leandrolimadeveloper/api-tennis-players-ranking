import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoriesModule } from 'src/categories/categories.module'
import { CategorySchema } from 'src/categories/interfaces/category.schema'
import { PlayersModule } from 'src/players/players.module'

import { ChallengesController } from './challenges.controller'
import { ChallengesService } from './challenges.service'
import { ChallengeSchema } from './interfaces/challenge.schema'
import { MatchSchema } from './matches/interface/match.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Challenge', schema: ChallengeSchema },
            { name: 'Category', schema: CategorySchema },
            { name: 'Match', schema: MatchSchema }
        ]),
        PlayersModule,
        CategoriesModule
    ],
    providers: [ChallengesService],
    controllers: [ChallengesController]
})
export class ChallengesModule { }
