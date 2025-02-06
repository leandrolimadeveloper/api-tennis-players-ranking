import mongoose from 'mongoose'

export const MatchSchema = new mongoose.Schema({
    category: { type: String },
    players: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
    ],
    winner: { type: String },
    loser: { type: String },
    result: [
        { set: { type: String } }
    ]
}, { timestamps: true, collection: 'matches' })