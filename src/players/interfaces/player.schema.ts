import * as mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, unique: true },
        name: { type: String },
        email: { type: String, unique: true },
        ranking: { type: String },
        score: { type: Number, default: 200, min: 0 },
        playerPhotoUrl: { type: String },
        category: { type: String, default: 'E' },
        hasWonChampionship: { type: Boolean, default: false },
        championshipWins: { type: Number, default: 0, required: function () { return this.hasWonChampionship } }
    },
    {
        timestamps: true, collection: 'players'
    }
)