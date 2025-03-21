/*
Category A (World Elite - Top 10) → The top 10 players in the app ranking.
Category B (High-Level Professionals) → 2,000+ points
Category C (Advanced Competitors) → 1,001 - 2,000 points
Category D (Growing Intermediate Players) → 501 - 1,000 points
Category E (Beginners and New Players) → 200 - 500 points
*/

import { Injectable } from '@nestjs/common'
import { CategoryName } from 'src/categories/interfaces/category-info.enum'
import { Player } from 'src/players/interfaces/player.interface'
import { PlayersService } from 'src/players/players.service'

@Injectable()
export class CheckCategoryByPlayerService {
    constructor(private readonly playersService: PlayersService) { }

    async checkCategoryByPlayer(player: Player) {
        if (player.score <= 0) {
            player.category = CategoryName.E
        }

        if (player.score >= 200 && player.score <= 500) {
            player.category = CategoryName.E
        } else if (player.score >= 501 && player.score <= 1000) {
            player.category = CategoryName.D
        } else if (player.score >= 1001 && player.score <= 2000) {
            player.category = CategoryName.C
        } else if (player.score > 2000) {
            player.category = CategoryName.B
        }

        // Fetch all players and sort them by score
        const players = await this.playersService.getAllPlayers()
        players.sort((a, b) => b.score - a.score)

        // Get the top 10 players
        const top10Players = players.slice(0, 10)

        // Set the category to A for the top 10 players
        for (const topPlayer of top10Players) {
            topPlayer.category = CategoryName.A
        }
    }
}
