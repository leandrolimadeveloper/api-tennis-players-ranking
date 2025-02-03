import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'

export class ValidateParametersPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'query' && (value === undefined || value === null || value === '')) {
            return undefined
        }

        if (!value) {
            throw new BadRequestException(`The value of the parameter "${metadata.data}" must be provided.`)
        }

        return value
    }
}
