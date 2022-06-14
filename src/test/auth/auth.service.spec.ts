import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

// Entity
import User from '../../entities/user.entity';
import Role from '../../entities/role.entity';
import Address from '../../entities/address.entity';

// Service
import { UsersService } from '../../modules/user/users.service';
import { AuthService } from '../../modules/auth/auth.service';

// Mocks
import { mockedConfigService, mockedJwtService } from '../../utils/mocks';
import { mockedRoleSystemAdmin, mockedUser } from './auth.mock';

// Dto
import RegisterDto from '../../modules/auth/dto/register.dto';
import { Repository } from 'typeorm';

jest.mock('bcrypt');

describe('The AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let userRepoMock: Repository<User>;

  let userData: User;
  let roleSystemAdmin: Role;

  let findOne: jest.Mock;
  let save: jest.Mock;
  let findRoleSystemAdmin: jest.Mock;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    userData = {
      ...mockedUser,
    };
    roleSystemAdmin = {
      ...mockedRoleSystemAdmin,
    };

    findOne = jest.fn().mockResolvedValue(userData);
    save = jest.fn().mockReturnValue(userData);
    findRoleSystemAdmin = jest.fn().mockResolvedValue(roleSystemAdmin);

    const usersRepository = {
      findOne,
      save,
    };
    const rolesRepository = {
      find: findRoleSystemAdmin,
    };

    const module = await Test.createTestingModule({
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
        {
          provide: getRepositoryToken(Address),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Role),
          useValue: rolesRepository,
        },
      ],
    }).compile();
    authService = await module.get(AuthService);
    usersService = await module.get(UsersService);

    userRepoMock = await module.get(getRepositoryToken(User));
  });

  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
      await authService.getAuthenticatedUser(
        'user@email.com',
        'strongPassword',
      );
      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        await expect(
          authService.getAuthenticatedUser('user@email.com', 'strongPassword'),
        ).rejects.toThrow();
      });
    });
    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findOne.mockReturnValue(Promise.resolve(userData));
        });
        it('should return the user data', async () => {
          const user = await authService.getAuthenticatedUser(
            'user@email.com',
            'strongPassword',
          );
          expect(user).toBe(userData);
        });
      });
      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findOne.mockReturnValue(Promise.resolve(userData));
        });
        it('should throw an error', async () => {
          await expect(
            authService.getAuthenticatedUser(
              'user@email.com',
              'strongPassword',
            ),
          ).rejects.toThrow();
        });
      });
    });
  });

  describe('when registering', () => {
    describe('and the provided email already exists', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      it.only('should throw an error', async () => {
        const registerData = new RegisterDto();
        registerData.email = userData.email;
        registerData.name = userData.name;
        registerData.password = userData.password;
        registerData.roles = userData.roles.map((item) => item.name);

        userRepoMock.save(userData);
        userRepoMock.save(userData);

        await expect(authService.register(registerData)).rejects.toThrow();
      });
    });
    describe('and the provided email is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      it.only('should return the user data', async () => {
        const registerData = new RegisterDto();
        registerData.email = 'new' + userData.email;
        registerData.name = userData.name;
        registerData.password = userData.password;
        registerData.roles = userData.roles.map((item) => item.name);

        const user = await authService.register(registerData);
        expect(user.email).toBe(registerData.email);
      });
    });
  });
});
