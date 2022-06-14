import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

// Entity
import User from '../../entities/user.entity';

// Controller
import { AuthController } from '../../modules/auth/auth.controller';

// Service
import { AuthService } from '../../modules/auth/auth.service';
import { UsersService } from '../../modules/user/users.service';

// Mocked
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { mockedUser } from './auth.mock';

describe('when registering', () => {
  let app: INestApplication;
  let userData: User;
  beforeEach(async () => {
    userData = {
      ...mockedUser,
    };
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('and using valid data', () => {
    it('should respond with the data of the user without the password', () => {
      const expectedData = {
        ...userData,
      };
      delete expectedData.password;
      return request(app.getHttpServer())
        .post('/authentication/register')
        .send({
          email: mockedUser.email,
          name: mockedUser.name,
          password: 'strongPassword',
        })
        .expect(201)
        .expect(expectedData);
    });
  });
  describe('and using invalid data', () => {
    it('should throw an error', () => {
      return request(app.getHttpServer())
        .post('/authentication/register')
        .send({
          name: mockedUser.name,
        })
        .expect(400);
    });
  });
});
