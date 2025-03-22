import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'
import { PlayersService } from 'src/players/players.service'

import { UpdateCategoryDto } from './dtos/update-category.dto'
import { Category } from './interfaces/category.interface'
import { CategoryName } from './interfaces/category-info.enum'

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

        // Update player score to the initial value of which category
        const initialValueCategory = {
            [CategoryName.B]: 2001,
            [CategoryName.C]: 1001,
            [CategoryName.D]: 501,
            [CategoryName.E]: 200
        }

        const players = await this.playersService.getAllPlayers()
        players.sort((a, b) => b.score - a.score)

        console.log('players', players)

        const top10Players = players.slice(0, 10)

        console.log('top10Players', top10Players)

        const playersInCategoryA = top10Players.filter(player => player.score > 2000)

        console.log('playersInCategoryA', playersInCategoryA)

        const remainingPlayersInCategoryB = players.filter(player => player.score > 2000 && !top10Players.includes(player))
        remainingPlayersInCategoryB.forEach(player => player.category = CategoryName.B)

        if (category.name === CategoryName.A) {
            if (playersInCategoryA.length < 10) {
                throw new BadRequestException('There are not enough players to assign category A')
            } else {
                player.score = initialValueCategory[CategoryName.A]
            }
        }

        if (category.name === CategoryName.B) {
            if (remainingPlayersInCategoryB) {
                player.score = initialValueCategory[CategoryName.B]
            }
        }

        if (category.name === CategoryName.C) {
            player.score = initialValueCategory[CategoryName.C]
        }

        if (category.name === CategoryName.D) {
            player.score = initialValueCategory[CategoryName.D]
        }

        if (category.name === CategoryName.E) {
            player.score = initialValueCategory[CategoryName.E]
        }

        // Update player score
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
