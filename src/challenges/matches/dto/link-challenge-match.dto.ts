/* eslint-disable indent */
import { IsNotEmpty } from 'class-validator'
import { MatchResult } from 'src/challenges/interfaces/challenge.interface'
import { Player } from 'src/players/interfaces/player.interface'

export class LinkChallengeMatchDto {
    @IsNotEmpty()
    players: Array<Player>

    @IsNotEmpty()
    winner: string

    @IsNotEmpty()
    loser: string

    @IsNotEmpty()
    result: Array<MatchResult>
}