import { Document } from 'mongoose'
import { Player } from 'src/players/interfaces/player.interface'

import { ChallengeStatus } from './challenge-status.enum'

export interface Challenge extends Document {
    challengeDateTime: Date
    status: ChallengeStatus,
    requestDateTime: Date
    responseDateTime: Date
    requester: Player
    category: string
    players: Array<Player>
    match: Match
}

export interface Match extends Document {
    category: string
    players: Array<Player>
    def: Player
    result: Array<MatchResult>
}

export interface MatchResult {
    set: string
}