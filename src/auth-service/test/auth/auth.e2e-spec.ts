import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import * as request from 'supertest';
import { connectPrismaClient, startPostgresql } from 'test/helpers';

describe('AuthController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication;

  let postgresContainer: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;

  beforeAll(async () => {
    jest.setTimeout(60000);
    prismaClient = await connectPrismaClient();
    postgresContainer = await startPostgresql();

    console.log('PostgreSQL started at:', postgresContainer.getConnectionUri());

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prismaClient.refreshToken.deleteMany({
      where: { email: 'testuser@example.com' },
    });
    await prismaClient.user.deleteMany({
      where: { email: 'testuser@example.com' },
    });
    await prismaClient.user.create({
      data: {
        id: '1',
        email: 'testuser@example.com',
        password:
          '$2a$10$qsSrRVmSr7H1XfpLSQ.HjOeO.P5jvwWF5NpP5/7tYO.lLApw7NTwi',
        name: 'Test User',
      },
    });

    await prismaClient.refreshToken.create({
      data: {
        token: 'xpto',
        userId: '1',
        email: 'testuser@example.com',
        revoked: false,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/token (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/token')
      .send({
        email: 'testuser@example.com',
        password: '123456',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('/auth/refresh-token (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({
        email: 'testuser@example.com',
        token: 'xpto',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });
});
