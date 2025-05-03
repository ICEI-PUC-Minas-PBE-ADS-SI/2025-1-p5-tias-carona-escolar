import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import { startPostgresql, connectPrismaClient } from 'test/helpers';

describe('UserController (e2e)', () => {
  jest.setTimeout(60000);
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let accessToken: string;

  beforeAll(async () => {
    jest.setTimeout(60000);
    await startPostgresql();
    prismaClient = await connectPrismaClient();

    await prismaClient.user.createMany({
      data: [
        {
          id: 'someUserId',
          name: 'User',
          email: 'email@example.com',
          username: 'someUser',
          password:
            '$2a$10$DUJlBeyfOGmMBdRQkA2KjO5S.iPoP5LAbCaoTFi72EldhrJMVxpuC',
        },
        {
          id: 'anotherUserId',
          name: 'Another User',
          email: 'anotheremail@example.com',
          username: 'anotherUser',
          password:
            '$2a$10$DUJlBeyfOGmMBdRQkA2KjO5S.iPoP5LAbCaoTFi72EldhrJMVxpuC',
        },
        {
          id: 'followeeUserId',
          name: 'Followee User',
          email: 'followee@example.com',
          username: 'followeeUser',
          password:
            '$2a$10$DUJlBeyfOGmMBdRQkA2KjO5S.iPoP5LAbCaoTFi72EldhrJMVxpuC',
        },
      ],
    });

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/token')
      .send({ email: 'email@example.com', password: '123456' });
    accessToken = loginResponse.body.access_token;
  });

  beforeEach(async () => {});

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'User A',
      email: 'xpto@gmail.com',
      username: 'usera',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      name: 'User A',
      email: 'xpto@gmail.com',
      username: 'usera',
      imgUrl: null,
      numberOfRecipes: 0,
      numberOfFollowers: 0,
      numberOfFollowings: 0,
    });
  });

  it('/users/:id (GET)', async () => {
    const userId = 'someUserId';
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('username');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('authProvider');
  });

  // it('/users/:id (PUT)', async () => {
  //   const userId = 'someUserId';
  //   const updateData = {
  //     name: 'Updated User',
  //     email: 'updatedemail@gmail.com',
  //     username: 'updateduser',
  //   };

  //   const response = await request(app.getHttpServer())
  //     .put(`/users/${userId}`)
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .send(updateData);

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('id', userId);
  //   expect(response.body).toMatchObject(updateData);
  // });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        limit: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).not.toHaveProperty('password');
    expect(response.body.data[0]).not.toHaveProperty('authProvider');
  });

  it('/users/follows/:followeeId (POST)', async () => {
    const followeeId = 'anotherUserId';
    const response = await request(app.getHttpServer())
      .post(`/users/follows/${followeeId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    console.log(response.body);
    expect(response.status).toBe(200);
  });

  it('/users/follows/:followeeId (DELETE)', async () => {
    const followeeId = 'followeeUserId';
    await prismaClient.follow.create({
      data: {
        id: 'some-follow-id',
        followerId: 'someUserId',
        followeeId,
      },
    });
    const response = await request(app.getHttpServer())
      .delete(`/users/follows/${followeeId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);
  });

  it('/users/follows/:id (GET)', async () => {
    const userId = 'someUserId';
    const response = await request(app.getHttpServer())
      .get(`/users/follows/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        limit: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
