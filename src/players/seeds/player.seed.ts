import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Player } from '../interfaces/player.interface'

export class PlayerSeeder {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) { }

    private readonly logger = new Logger(PlayerSeeder.name)

    async seedPlayers(quantity: number) {
        // Clear existing players
        await this.playerModel.deleteMany({})

        const players = []

        for (let i = 0; i < quantity; i++) {
            const score = await this.generateRandomScore()
            const category = this.assignCategory(score)

            players.push({
                phoneNumber: `+556199999999${i}`,
                email: `player${i + 1}@example.com`,
                name: `Player ${i + 1}`,
                ranking: `Ranking ${i + 1}`,
                playerPhotoUrl: `https://i.pravatar.cc/300?img=${i + 1}`,
                score,
                category,
                hasWonChampionship: false,
                championshipWins: 0
            })
        }

        players.sort((a, b) => b.score - a.score)

        players.slice(0, 10).forEach(player => (player.category = 'A'))

        players.forEach(player => {
            if (player.score > 2000 && !players.slice(0, 10).includes(player)) {
                player.category = 'B'
            }
        })

        await this.playerModel.insertMany(players)
        this.logger.log(`${quantity} players created successfully.`)
    }

    async generateRandomScore(): Promise<number> {
        const scoreRanges = {
            A: [2100, 3000],
            B: [2001, 2099],
            C: [1001, 2000],
            D: [501, 1000],
            E: [200, 500]
        }

        const categories = Object.keys(scoreRanges)
        const selectedCategory = categories[Math.floor(Math.random() * categories.length)]
        const [min, max] = scoreRanges[selectedCategory]

        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    private assignCategory(score: number): string {
        if (score > 2000) return 'B'
        if (score > 1000) return 'C'
        if (score > 500) return 'D'
        return 'E'
    }
}