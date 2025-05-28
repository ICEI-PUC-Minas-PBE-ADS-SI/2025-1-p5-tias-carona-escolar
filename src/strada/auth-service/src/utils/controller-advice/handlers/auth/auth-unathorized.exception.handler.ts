import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';
import { AuthUnauthorizedException } from '@/src/auth/core/exceptions/unauthorized.exceptions';

export class AuthUnauthorizedExceptionHandler extends ExceptionHandler<AuthUnauthorizedException> {
  private readonly logger = new Logger(AuthUnauthorizedExceptionHandler.name);

  constructor() {
    super();
  }
  public handle(exception: AuthUnauthorizedException, response, request): void {
    this.logger.error(exception.message);
    response.status(401).json({
      statusCode: 401,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
