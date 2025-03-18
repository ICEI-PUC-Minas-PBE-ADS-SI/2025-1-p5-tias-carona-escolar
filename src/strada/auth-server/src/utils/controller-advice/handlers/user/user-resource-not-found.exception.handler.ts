import { UserResourceNotFoundException } from '@/src/user/core/exceptions/resource-not-found.exception';
import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';

export class UserResourceNotFoundExceptionHandler extends ExceptionHandler<UserResourceNotFoundException> {
  private readonly logger = new Logger(
    UserResourceNotFoundExceptionHandler.name,
  );

  constructor() {
    super();
  }
  public handle(
    exception: UserResourceNotFoundException,
    response,
    request,
  ): void {
    this.logger.error(exception.message);
    response.status(404).json({
      statusCode: 404,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
