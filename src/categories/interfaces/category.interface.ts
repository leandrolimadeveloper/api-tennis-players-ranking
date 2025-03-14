import { Document, Types } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'

export interface Category extends Document {
    readonly name: string
    description: string
    events: Array<Event>
    players: Array<Types.ObjectId | Player>

}

export interface Event {
    name: string
    operation: string
    value: number
}