import { AuthDomainException } from '@/src/auth/core/exceptions/domain.exception';
import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';

export class AuthDomainExceptionHandler extends ExceptionHandler<AuthDomainException> {
  private readonly logger = new Logger(AuthDomainExceptionHandler.name);

  constructor() {
    super();
  }
  public handle(exception: AuthDomainException, response, request): void {
    this.logger.error(exception.message);
    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
