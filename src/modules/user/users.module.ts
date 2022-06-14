import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controller
import { UsersController } from './users.controller';
// Service
import { UsersService } from './users.service';

// Entity
import Address from '../../entities/address.entity';
import Role from '../../entities/role.entity';
import User from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
