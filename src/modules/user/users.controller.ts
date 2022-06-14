import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

// Entity
import User from '../../entities/user.entity';

// Guard
import JwtAuthGuard from '../auth/guard/jwtAuth.guard';

// Dto
import UpdateUserDto from './dto/updateUser.dto';

// Service
import { UsersService } from './users.service';

@Controller('user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Get user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Get user unsuccessfully',
  })
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Query() queries) {
    const { email } = queries;
    const users = this.usersService.getByEmail(email);
    return users;
  }

  @Patch('/:userId')
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Update user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Update user unsuccessfully',
  })
  async updateUserById(
    @Req() request,
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = params;
    const updatedUser = await this.usersService.updateUserById(
      Number(userId),
      updateUserDto,
    );
    return updatedUser;
  }
}
