import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR

        const message = exception instanceof HttpException ? exception.getResponse() : exception

        this.logger.error(`HTTP Status: ${status},\n Error Message: ${JSON.stringify(message)}`)

        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message
        })
    }
}