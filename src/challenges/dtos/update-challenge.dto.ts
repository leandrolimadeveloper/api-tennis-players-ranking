/* eslint-disable indent */
import { Transform } from 'class-transformer'
import { IsDateString, IsIn, IsOptional } from 'class-validator'

export class UpdateChallengeDto {
    @IsOptional()
    @IsDateString()
    challengeDateTime: Date

    @IsOptional()
    @Transform(({ value }) => value.toUpperCase())
    @IsIn(['ACEITO', 'RECUSADO', 'CANCELADO'], { message: 'Status must be ACEITO, RECUSADO, or CANCELADO' })
    status: string
}