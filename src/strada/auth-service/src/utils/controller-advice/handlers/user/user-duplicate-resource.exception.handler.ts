import { UserDuplicateresourceException } from '@/src/user/core/exceptions/duplicate-resource.exception';
import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';

export class UserDuplicateresourceExcetionHandler extends ExceptionHandler<UserDuplicateresourceException> {
  private readonly logger = new Logger(
    UserDuplicateresourceExcetionHandler.name,
  );

  constructor() {
    super();
  }
  public handle(
    exception: UserDuplicateresourceException,
    response,
    request,
  ): void {
    this.logger.error(exception.message);
    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
