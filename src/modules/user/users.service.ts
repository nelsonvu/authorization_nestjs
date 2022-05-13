import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Address from 'src/entities/address.entity';
import { Repository } from 'typeorm';
import User from '../../entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
 
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Address)
    private addresesRepository: Repository<Address>
  ) {
  }
 
  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: {email} });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }
 
  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: {id} });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async createUser(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async updateUserById(userId: number, userData: UpdateUserDto) {
    console.log(userData, userId)
    let user = await this.getById(userId)

    if (!user.address?.id) {
      let address = await this.addresesRepository.save(
        userData.address
      )
      await this.usersRepository.update(
        {
          "id": userId 
        },
        {
          "address": address
        }
      )
      user = await this.getById(userId)
    } else {
      await this.addresesRepository.update(
        { "id": user.address.id },
        userData.address
      )
    }
    
    return user;
  }
}