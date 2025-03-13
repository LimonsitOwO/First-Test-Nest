import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { User } from './../src/users/entities/user.entity';

describe('UsersController (E2E)', () => {
  let app: INestApplication;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser = { id: 1, name: 'Luis', email: 'luis@example.com', password: '123456' };

  const userRepositoryMock = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(null),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(userRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = moduleFixture.get(getRepositoryToken(User));
  });

  it('/users (POST) - Should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Luis', email: 'luis@example.com', password: '123456' })
      .expect(201);

    expect(response.body).toMatchObject({ name: 'Luis', email: 'luis@example.com' });
    expect(userRepository.create).toHaveBeenCalledWith({ name: 'Luis', email: 'luis@example.com', password: '123456' });
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  afterAll(async () => {
    await app.close();
  });
});
