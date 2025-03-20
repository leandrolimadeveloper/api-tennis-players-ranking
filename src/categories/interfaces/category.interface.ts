import { Document, Types } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'

import { CategoryInfo, CategoryName } from './category-info.enum'

export interface Category extends Document {
    name: CategoryName
    description: CategoryInfo
    events: Array<Event>
    players: Array<Types.ObjectId | Player>

}

export interface Event {
    name: string
    operation: string
    value: number
}