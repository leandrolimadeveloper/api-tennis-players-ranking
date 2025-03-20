import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'
import { PlayersService } from 'src/players/players.service'

import { UpdateCategoryDto } from './dtos/update-category.dto'
import { Category } from './interfaces/category.interface'

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService
    ) { }

    private readonly logger = new Logger(CategoriesService.name)

    async getCategories(): Promise<Array<Category>> {
        return await this.categoryModel.find().sort({ name: 1 }).populate('players').exec()
    }

    async getCategory(id: string): Promise<Category> {
        const category = await this.findCategory(id)

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        return category
    }

    async findCategoryByPlayer(playerId: string): Promise<Category | null> {
        const requesterPlayerCategory = await this.categoryModel.findOne({ players: playerId })

        return requesterPlayerCategory
    }

    async updateCategoryById(id: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
        const category = await this.findCategory(id)

        if (!category) {
            throw new NotFoundException()
        }

        await this.categoryModel.findByIdAndUpdate(category.id, updateCategoryDto)
    }

    async assignCategoryToPlayer(params: string[]): Promise<void> {
        const categoryName = params['categoryName']
        const playerId = params['playerId']

        const category = await this.findCategory(categoryName)

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        // Verify if player exists
        const player = await this.playersService.getPlayer(playerId)

        const isPlayerInCategory = await this.categoryModel.findOne({ name: categoryName }).where('players').in(playerId)

        if (isPlayerInCategory) {
            throw new BadRequestException(`Player ${player.name} is already registered in the category ${category.name}`)
        }

        const isPlayerInAnyCategory = await this.categoryModel.find({ players: player })

        if (isPlayerInAnyCategory.length >= 1) {
            throw new BadRequestException([
                'It is not possible to assign category to player in other category.',
                `Player is already registered in category ${isPlayerInAnyCategory.map(category => category.name)}`
            ])
        }

        // Update category field in Player module
        player.category = category.name
        await player.save()

        category.players.push(playerId)
        await category.save()
    }

    async arePlayersInCategories(players: Player[]): Promise<boolean> {
        const playersInCategories = await Promise.all(
            players.map(async (player) => {
                return await this.categoryModel.exists({ players: player._id })
            })
        )

        if (playersInCategories.includes(null)) {
            this.logger.warn('One or more player IDs are missing in all')
            return false
        }

        this.logger.log('All player IDs are found in some category')

        return true
    }

    private async findCategory(identifier: string) {
        // Determine if the identifier is an ObjectId or a name
        const query = Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { name: identifier }

        return await this.categoryModel.findOne(query).exec()
    }
}
