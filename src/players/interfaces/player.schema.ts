import * as mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, unique: true },
        name: { type: String },
        email: { type: String, unique: true },
        ranking: { type: String },
        score: { type: Number },
        playerPhotoUrl: { type: String },
        category: { type: String, default: 'No category' },
        hasWonChampionship: { type: Boolean, default: false },
        championshipWins: { type: Number, default: 0, required: function () { return this.hasWonChampionship } }
    },
    {
        timestamps: true, collection: 'players'
    }
)