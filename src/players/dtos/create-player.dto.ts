import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, Matches, Min, ValidateIf } from 'class-validator'

export class CreatePlayerDto {
    @IsNotEmpty()
    @Matches(/^\d{10,11}$/, {
        message: 'Phone number must contain 10 or 11 digits without special characters.'
    })
    readonly phoneNumber: string

    @IsNotEmpty()
    readonly name: string

    @IsEmail()
    readonly email: string

    @IsInt()
    @IsOptional()
    readonly score: number

    @IsBoolean()
    @IsOptional()
    readonly hasWonChampionship: boolean

    @ValidateIf((object => object.hasWonChampionship === true))
    @IsInt()
    @Min(1)
    readonly championshipWins: number
}