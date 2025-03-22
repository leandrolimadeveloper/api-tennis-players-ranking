import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Category } from './interfaces/category.interface'
import { CategoryInfo, CategoryName } from './interfaces/category-info.enum'

export class CategorySeedService {
    constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) { }

    async seedCategories() {
        const defaultCategories = [
            {
                name: CategoryName.A,
                description: CategoryInfo.CATEGORY_A
            },
            {
                name: CategoryName.B,
                description: CategoryInfo.CATEGORY_B
            },
            {
                name: CategoryName.C,
                description: CategoryInfo.CATEGORY_C
            },
            {
                name: CategoryName.D,
                description: CategoryInfo.CATEGORY_D
            },
            {
                name: CategoryName.E,
                description: CategoryInfo.CATEGORY_E
            }
        ]

        const categories = await this.categoryModel.find()

        if (categories.length === 0) {
            await this.categoryModel.insertMany(defaultCategories)
        }
    }

}