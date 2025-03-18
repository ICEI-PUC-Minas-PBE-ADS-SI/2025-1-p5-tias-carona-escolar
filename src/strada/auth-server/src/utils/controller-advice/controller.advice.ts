import { Injectable } from '@nestjs/common';
import { ExceptionHandler } from './exception.handler';
import { UserDomainExceptionHandler } from './handlers/user/user-domain.exception.handler';
import { UserInvalidFieldValueExceptionHandler } from './handlers/user/user-invalid-field-value.exception.handler';
import { UserResourceNotFoundExceptionHandler } from './handlers/user/user-resource-not-found.exception.handler';
import { UserDuplicateresourceExcetionHandler } from './handlers/user/user-duplicate-resource.exception.handler';
import { AuthDomainExceptionHandler } from './handlers/auth/auth-domain.exception.handler';
import { AuthResourceNotFoundExceptionHandler } from './handlers/auth/auth-resource-not-found.exception.handler';
import { AuthUnauthorizedExceptionHandler } from './handlers/auth/auth-unathorized.exception.handler';
import { AuthDomainException } from '@/src/auth/core/exceptions/domain.exception';
import { AuthResourceNotFoundException } from '@/src/auth/core/exceptions/resource-not-found.exception';
import { AuthUnauthorizedException } from '@/src/auth/core/exceptions/unauthorized.exceptions';
import { UserDomainException } from '@/src/user/core/exceptions/domain.exception';
import { UserInvalidFieldValueException } from '@/src/user/core/exceptions/invalid-field-value.exception';
import { UserResourceNotFoundException } from '@/src/user/core/exceptions/resource-not-found.exception';
import { UserDuplicateresourceException } from '@/src/user/core/exceptions/duplicate-resource.exception';

@Injectable()
export class ControllerAdvice {
  private readonly handlers: Map<string, ExceptionHandler<Error>>;

  constructor() {
    this.handlers = new Map();

    this.registryHandlers();
  }

  private registryHandlers(): void {
    this.handlers.set(
      UserDomainException.name,
      new UserDomainExceptionHandler(),
    );
    this.handlers.set(
      UserInvalidFieldValueException.name,
      new UserInvalidFieldValueExceptionHandler(),
    );
    this.handlers.set(
      UserResourceNotFoundException.name,
      new UserResourceNotFoundExceptionHandler(),
    );
    this.handlers.set(
      UserDuplicateresourceException.name,
      new UserDuplicateresourceExcetionHandler(),
    );
    this.handlers.set(
      AuthDomainException.name,
      new AuthDomainExceptionHandler(),
    );
    this.handlers.set(
      AuthResourceNotFoundException.name,
      new AuthResourceNotFoundExceptionHandler(),
    );
    this.handlers.set(
      AuthUnauthorizedException.name,
      new AuthUnauthorizedExceptionHandler(),
    );
  }

  public handle(exception: Error, response, request): void {
    const handler = this.handlers.get(exception.name);
    if (handler) {
      handler.handle(exception, response, request);
      return;
    }
    console.error('No handler found for exception: ', exception);
  }
}
