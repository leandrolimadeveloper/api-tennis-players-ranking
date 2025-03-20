import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'

import { CategoriesService } from './categories.service'
import { UpdateCategoryDto } from './dtos/update-category.dto'
import { Category } from './interfaces/category.interface'

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async getCategories(): Promise<Array<Category>> {
        return await this.categoriesService.getCategories()
    }

    @Get(':id')
    async getCategory(
        @Param('id') id: string
    ): Promise<Category> {
        return await this.categoriesService.getCategory(id)
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    async updateCategoryById(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<void> {
        return await this.categoriesService.updateCategoryById(id, updateCategoryDto)
    }

    @Post('/:categoryName/players/:playerId')
    async assignCategoryToPlayer(
        @Param() params: string[]
    ): Promise<void> {
        return await this.categoriesService.assignCategoryToPlayer(params)
    }
}
