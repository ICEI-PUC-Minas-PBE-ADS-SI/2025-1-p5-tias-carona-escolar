import { UserDomainException } from '@/src/user/core/exceptions/domain.exception';
import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';

export class UserDomainExceptionHandler extends ExceptionHandler<UserDomainException> {
  private readonly logger = new Logger(UserDomainExceptionHandler.name);

  constructor() {
    super();
  }
  public handle(exception: UserDomainException, response, request): void {
    this.logger.error(exception.message);
    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
