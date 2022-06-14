import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

// Entity
import Address from '../../entities/address.entity';
import User from '../../entities/user.entity';
import Role, { Roles } from '../../entities/role.entity';

// Dto
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Address)
    private addresesRepository: Repository<Address>,

    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async createUser(userData: CreateUserDto) {
    const { email, name, password, roles } = userData;

    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = password;

    let roleEntities = [];
    if (roles.length > 0) {
      roleEntities = await this.rolesRepository.find({
        where: {
          name: In(roles),
        },
      });
    } else {
      const role = await this.rolesRepository.find({
        where: {
          name: Roles.MEMBER,
        },
      });
      roleEntities.push(role);
    }

    newUser.roles = roleEntities;

    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async updateUserById(userId: number, userData: UpdateUserDto) {
    let user = await this.getById(userId);

    if (!user.address?.id) {
      const address = await this.addresesRepository.save(userData.address);
      await this.usersRepository.update(
        {
          id: userId,
        },
        {
          address: address,
        },
      );
      user = await this.getById(userId);
    } else {
      await this.addresesRepository.update(
        { id: user.address.id },
        userData.address,
      );
    }

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
