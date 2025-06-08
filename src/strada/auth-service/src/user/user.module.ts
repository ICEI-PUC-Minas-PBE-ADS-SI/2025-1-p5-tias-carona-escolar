import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { CreateUserUseCase } from './core/use-cases/create-user.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository.impl';
import { PrismaService } from '@/src/utils/prisma.service';
import { IUserRepository } from './core/interfaces/repositories/user-repository.interface';
import { IPasswordEncoder } from '../auth/core/interfaces/utils/password-encoder.interface';
import { FindUserByEmailUseCase } from './core/use-cases/find-user-by-email.use-case';
import { FindUserByIdlUserUseCase } from './core/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from './core/use-cases/update-user.use-case';
import { FindAllUseCase } from './core/use-cases/find-all-use-case';
import { AuthModule } from '@/src/auth/auth.module';
import { UpdateUserPasswordUseCase } from './core/use-cases/update-user-password.use-case';
import { UserGrpcController } from './infrastructure/controllers/user-grpc.controller';
import { GuardianService } from './core/use-cases/guardians.service';
import { GuardianController } from './infrastructure/controllers/guardians.controller';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController, UserGrpcController, GuardianController],
  providers: [
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        passwordEncoder: IPasswordEncoder,
      ) => {
        return new CreateUserUseCase(userRepository, passwordEncoder);
      },
      inject: ['IUserRepository', 'IPasswordEncoder'],
    },
    {
      provide: FindUserByEmailUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new FindUserByEmailUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: FindUserByIdlUserUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new FindUserByIdlUserUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (
        userRepository: IUserRepository,
        findUserByIdlUserUseCase: FindUserByIdlUserUseCase,
      ) => {
        return new UpdateUserUseCase(userRepository, findUserByIdlUserUseCase);
      },
      inject: ['IUserRepository', FindUserByIdlUserUseCase],
    },
    {
      provide: FindAllUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new FindAllUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: UpdateUserPasswordUseCase,
      useFactory: (
        userRepository: IUserRepository,
        passwordEncoder: IPasswordEncoder,
      ) => {
        return new UpdateUserPasswordUseCase(userRepository, passwordEncoder);
      },
      inject: ['IUserRepository', 'IPasswordEncoder'],
    },
    {
      provide: GuardianService,
      useFactory: (userRepository: IUserRepository) => {
        return new GuardianService(userRepository);
      },
      inject: ['IUserRepository'],
    },
  ],
  exports: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    UpdateUserPasswordUseCase,
  ],
})
export class UserModule {}
