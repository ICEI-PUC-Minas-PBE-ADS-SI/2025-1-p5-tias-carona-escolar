import { PrismaClient } from '@prisma/client';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let postgresContainer: StartedPostgreSqlContainer;
let prismaClient: PrismaClient;
let connectionUri: string;

let isPostgresStarted = false;
let isPrismaConnected = false;

export const startPostgresql =
  async (): Promise<StartedPostgreSqlContainer> => {
    if (isPostgresStarted) {
      return postgresContainer;
    }

    try {
      postgresContainer = await new PostgreSqlContainer()
        .withReuse()
        .withExposedPorts(54332)
        .start();

      connectionUri = postgresContainer.getConnectionUri();
      process.env.DATABASE_URL = connectionUri;

      console.log('PostgreSQL started at:', connectionUri);
      isPostgresStarted = true;

      return postgresContainer;
    } catch (error) {
      console.error('Error starting PostgreSQL container:', error);
      throw error;
    }
  };

export const connectPrismaClient = async (): Promise<PrismaClient> => {
  if (isPrismaConnected) {
    return prismaClient;
  }

  if (!isPostgresStarted) {
    await startPostgresql();
  }

  try {
    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: connectionUri,
        },
      },
    });

    await prismaClient.$connect();

    console.log('Running migrations...');
    execSync(`npx prisma migrate reset --force`, {
      env: {
        ...process.env,
        DATABASE_URL: connectionUri,
      },
    });
    execSync(`npx prisma migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: connectionUri,
      },
    });

    await prismaClient.$queryRaw`SELECT 1`;

    console.log('Prisma client connected and migrations applied');
    isPrismaConnected = true;

    return prismaClient;
  } catch (error) {
    console.error('Error connecting Prisma Client:', error);
    throw error;
  }
};
