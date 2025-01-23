import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'
import { PlayersService } from 'src/players/players.service'

import { CreateCategoryDto } from './dtos/create-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto'
import { Category } from './interfaces/category.interface'

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService
    ) { }

    private readonly logger = new Logger(CategoriesService.name)

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { name } = createCategoryDto

        const category = await this.findCategory(name)

        if (category) {
            throw new BadRequestException('Category already exists')
        }

        const categoryCreated = new this.categoryModel(createCategoryDto)
        return await categoryCreated.save()
    }

    async getCategories(): Promise<Array<Category>> {
        return await this.categoryModel.find().populate('players').exec()
    }

    async getCategory(id: string): Promise<Category> {
        const category = await this.findCategory(id)

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        return category
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

        console.log('category:', category)

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        // Verify if player exists
        const player = await this.playersService.getPlayer(playerId)

        const isPlayerInCategory = await this.categoryModel.findOne({ name: categoryName }).where('players').in(playerId)

        console.log('isPlayerInCategory:', isPlayerInCategory)

        if (isPlayerInCategory) {
            throw new BadRequestException(`Player ${player.name} is already registered in the category ${category.name}`)
        }

        category.players.push(playerId)
        await category.save()
        console.log('playerId:', playerId)

        console.log('category.players:', category)
    }

    async arePlayersInCategories(players: Player[]): Promise<boolean> {
        const playersInCategories = await this.categoryModel.find({
            players: { $all: players }
        }).exec()

        if (playersInCategories.length > 0) {
            this.logger.log('Both player IDs are found in some category.')
        } else {
            this.logger.warn('One or more player IDs are missing in all categories.')
        }

        return playersInCategories.length > 0
    }

    private async findCategory(identifier: string) {
        // Determine if the identifier is an ObjectId or a name
        const query = Types.ObjectId.isValid(identifier)
            ? { _id: identifier }
            : { name: identifier }

        return await this.categoryModel.findOne(query).exec()
    }
}
