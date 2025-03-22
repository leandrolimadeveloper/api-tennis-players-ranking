import { INestApplication } from '@nestjs/common'
import { CategorySeedService } from 'src/categories/category-seed.service'
import { PlayerSeeder } from 'src/players/seeds/player.seed'

export async function runSeeders(app: INestApplication) {
    if (process.env.CATEGORY_SEEDER_STATUS === 'true') {
        const categorySeeder = app.get(CategorySeedService)
        await categorySeeder.seedCategories()
    }

    if (process.env.PLAYER_SEEDER_STATUS === 'true') {
        const playerSeeder = app.get(PlayerSeeder)
        await playerSeeder.seedPlayers(50)
    }
}