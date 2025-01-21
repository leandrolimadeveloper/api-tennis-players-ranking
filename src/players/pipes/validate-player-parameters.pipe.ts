import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'

export class ValidatePlayerParametersPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException(`The value of the parameter "${metadata.data}" must be provided.`)
        }

        return value
    }
}
