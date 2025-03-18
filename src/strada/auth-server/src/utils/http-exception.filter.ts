import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ControllerAdvice } from './controller-advice/controller.advice';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly controllerAdvice: ControllerAdvice) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      response.status(status).json({
        ...(typeof errorResponse === 'object'
          ? errorResponse
          : { message: errorResponse }),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }
    this.controllerAdvice.handle(exception, response, request);
  }
}
