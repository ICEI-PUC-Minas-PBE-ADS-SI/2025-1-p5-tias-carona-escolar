import { IUserRepository } from '@/src/user/core/interfaces/repositories/user-repository.interface';
import { FindAllUseCase } from '@/src/user/core/use-cases/find-all-use-case';

describe('FindAllUsersUseCase', () => {
  let findAllUsersUseCase: FindAllUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findAllUsersUseCase = new FindAllUseCase(userRepository);
  });

  it('Should return a paginated list of users', async () => {
    userRepository.findAll.mockResolvedValue({
      total: 1,
      users: [
        {
          id: 'user-id',
          name: 'John Doe',
          imgUrl: null,
          numberOfRecipes: 0,
          numberOfFollowers: 0,
          numberOfFollowings: 0,
          username: 'john_doe',
        },
      ],
    });

    const result = await findAllUsersUseCase.execute({ page: 1, limit: 10 });

    expect(result.data).toBeDefined();
    expect(result.total).toBeDefined();
    expect(result.page).toEqual(1);
    expect(result.limit).toEqual(10);
  });
});
