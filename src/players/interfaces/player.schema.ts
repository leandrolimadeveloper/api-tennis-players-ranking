import * as mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, unique: true },
        name: { type: String },
        email: { type: String, unique: true },
        ranking: { type: String },
        positionRanking: { type: Number },
        playerPhotoUrl: { type: String }
    },
    {
        timestamps: true, collection: 'players'
    }
)