/* eslint-disable indent */
import { IsDateString, IsIn } from 'class-validator'

export class UpdateChallengeDto {
    @IsDateString()
    challengeDateTime: Date

    @IsIn(['ACEITO', 'NEGADO', 'CANCELADO'], { message: 'Status must be ACEITO, NEGADO, or CANCELADO' })
    status: string
}