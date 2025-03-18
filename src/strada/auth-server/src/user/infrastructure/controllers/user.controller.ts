import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CreateUserUseCase } from '@/src/user/core/use-cases/create-user.use-case';
import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { FindUserByIdlUserUseCase } from '@/src/user/core/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '@/src/user/core/use-cases/update-user.use-case';
import { FindAllUseCase } from '@/src/user/core/use-cases/find-all-use-case';
import { FollowUserByIdUseCase } from '../../core/use-cases/follow-user-by-id.use-case';
import { UnfollowUserByIdUseCase } from '../../core/use-cases/unfollow-user-by-id.use-case';
import { FindFollowingUsersUseCase } from '../../core/use-cases/find-following-users.use-case';
import { Public } from '@/src/auth/infrastructure/utils/auth.public';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdlUserUseCase: FindUserByIdlUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUseCase: FindAllUseCase,
    private readonly followUserUseCase: FollowUserByIdUseCase,
    private readonly unfollowUserUseCase: UnfollowUserByIdUseCase,
    private readonly findFollowingUsersUseCase: FindFollowingUsersUseCase,
  ) {}

  @Public()
  @Post()
  async create(@Body() userDto: UserRequestDto): Promise<UserResponseDto> {
    return await this.createUserUseCase.execute(userDto);
  }

  @Get(':id')
  async findById(@Param() id: { id: string }): Promise<UserResponseDto> {
    return await this.findUserByIdlUserUseCase.execute(id.id);
  }

  @Put(':id')
  async update(
    @Param() id: { id: string },
    @Body() userDto: UserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.updateUserUseCase.execute(id.id, userDto);
  }

  @Get()
  async findUsers(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.findAllUseCase.execute({ name, page, limit });
  }

  @Post('follows/:followeeId')
  @HttpCode(200)
  async follow(
    @Param() { followeeId }: { followeeId: string },
    @Request() req,
  ) {
    const followerId = req.user.sub;
    return this.followUserUseCase.execute({
      followerId: followerId,
      followeeId: followeeId,
    });
  }

  @Delete('follows/:followeeId')
  @HttpCode(204)
  async unfollow(
    @Param() { followeeId }: { followeeId: string },
    @Request() req,
  ) {
    const followerId = req.user.sub;
    return this.unfollowUserUseCase.execute({
      followerId,
      followeeId,
    });
  }

  @Get('follows/:id')
  async findFollowingUsers(
    @Param() id: { id: string },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.findFollowingUsersUseCase.execute(id.id, {
      page,
      limit,
    });
  }
}
