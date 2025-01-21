import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreatePlayerDto {
    @IsNotEmpty()
    readonly phoneNumber: string

    @IsNotEmpty()
    readonly name: string

    @IsEmail()
    readonly email: string
}