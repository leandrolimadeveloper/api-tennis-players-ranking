import * as mongoose from 'mongoose'

import { CategoryInfo, CategoryName } from './category-info.enum'

export const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true, enum: Object.values(CategoryName) },
    description: { type: String, enum: Object.values(CategoryInfo) },
    events: [
        {
            name: { type: String },
            operation: { type: String },
            value: { type: Number }
        }
    ],
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }]
}, { timestamps: true, collection: 'categories' })