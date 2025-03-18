import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status, ServiceError } from '@grpc/grpc-js';

@Catch(Error)
export class GlobalGrpcExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost): void {
    const isRpc = host.getType() === 'rpc';
    if (isRpc) {
      this.handleGrpcException(exception, host);
    } else {
      throw exception;
    }
  }

  private handleGrpcException(exception: Error, _host: ArgumentsHost): void {
    if (exception instanceof RpcException) {
      throw exception;
    }

    const grpcError: ServiceError = {
      code: status.INTERNAL,
      message: 'Internal server error',
      name: exception.name,
      details: exception.message || '',
      metadata: undefined,
    };

    if (exception.message.includes('not found')) {
      grpcError.code = status.NOT_FOUND;
      grpcError.message = exception.message;
    } else if (exception.message.includes('invalid')) {
      grpcError.code = status.INVALID_ARGUMENT;
      grpcError.message = exception.message;
    }

    throw new RpcException(grpcError);
  }
}