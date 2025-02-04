import mongoose from 'mongoose'

export const ChallengeSchema = new mongoose.Schema({
    challengeDateTime: { type: Date },
    status: { type: String, uppercase: true },
    requestDateTime: { type: Date },
    responseDateTime: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }
}, { timestamps: true, collection: 'challenges' })
