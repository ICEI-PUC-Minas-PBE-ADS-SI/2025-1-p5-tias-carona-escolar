import { UserInvalidFieldValueException } from '@/src/user/core/exceptions/invalid-field-value.exception';
import { ExceptionHandler } from '../../exception.handler';
import { Logger } from '@nestjs/common';

export class UserInvalidFieldValueExceptionHandler extends ExceptionHandler<UserInvalidFieldValueException> {
  private readonly logger = new Logger(
    UserInvalidFieldValueExceptionHandler.name,
  );

  constructor() {
    super();
  }
  public handle(
    exception: UserInvalidFieldValueException,
    response,
    request,
  ): void {
    this.logger.error(exception.message);
    response.status(422).json({
      statusCode: 422,
      message: exception.getErrorMessages(),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
