import { NestFactory } from '@nestjs/core'
import * as momentTimezone from 'moment-timezone'

import { AppModule } from './app.module'
import { AllExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalFilters(new AllExceptionFilter)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Date.prototype.toJSON = function (): any {
        return momentTimezone(this)
            .tz('America/Sao_Paulo')
            .format('DD-MM-YYYY HH:mm:ss.SSS')
    }

    await app.listen(process.env.PORT ?? 8080)
}
bootstrap()
