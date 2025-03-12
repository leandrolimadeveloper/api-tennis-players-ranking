import { Document } from 'mongoose'

export interface Player extends Document {
    readonly phoneNumber: string
    readonly email: string
    name: string
    ranking: string
    score: number
    playerPhotoUrl: string
    category: string
}