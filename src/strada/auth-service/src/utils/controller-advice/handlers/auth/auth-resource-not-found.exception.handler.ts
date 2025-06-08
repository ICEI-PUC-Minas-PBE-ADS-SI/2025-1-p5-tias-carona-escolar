import { AuthResourceNotFoundException } from '@/src/auth/core/exceptions/resource-not-found.exception';
import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';

export class AuthResourceNotFoundExceptionHandler extends ExceptionHandler<AuthResourceNotFoundException> {
  private readonly logger = new Logger(
    AuthResourceNotFoundExceptionHandler.name,
  );

  constructor() {
    super();
  }
  public handle(
    exception: AuthResourceNotFoundException,
    response,
    request,
  ): void {
    this.logger.error(exception.message);
    response.status(404).json({
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
