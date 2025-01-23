/* eslint-disable indent */
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>
}