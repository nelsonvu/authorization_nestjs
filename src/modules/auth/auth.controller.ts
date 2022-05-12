import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

// Service
import { UsersService } from '../user/users.service';
import { AuthService } from './auth.service';

// Dto
import { RegisterDto } from './dto/register.dto';

// Interface
import RequestWithUser from './interfaces/requestWithUser.interface';

// Guard
import JwtAuthGuard from './guard/jwtAuth.guard';
import { LocalAuthGuard } from './guard/localAuth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
    }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        let user = await this.authService.register(registrationData);
        console.log(user)

        return user
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
        const { user } = request;
        const token = await this.authService.getJwtToken(user.id);
        response.cookie("Authentication", token)
        user.password = undefined;

        response.status(200).send(user)
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.cookie("Authentication", null)

        return response.sendStatus(200);
    }
}