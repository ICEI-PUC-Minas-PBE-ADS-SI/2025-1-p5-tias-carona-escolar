import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './utils/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ControllerAdvice } from './utils/controller-advice/controller.advice';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GlobalGrpcExceptionFilter } from './utils/grpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new GlobalExceptionFilter(new ControllerAdvice()));

  const config = new DocumentBuilder()
    .setTitle('Recipes')
    .setDescription('A simple API to manage and share recipes')
    .setVersion('1.0')
    .addTag('recipes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, documentFactory);


  const grpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: "user",
      protoPath: join(__dirname, '..', 'user', 'infrastructure', 'proto', 'user.proto'),
      url: '0.0.0.0:50051',
    }
  }

  const microservice = app.connectMicroservice(grpcOptions);

  microservice.useGlobalFilters(new GlobalGrpcExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
