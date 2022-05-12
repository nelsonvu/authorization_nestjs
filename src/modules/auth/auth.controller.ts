import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, HttpStatus, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

// Service
import { UsersService } from '../user/users.service';
import { AuthService } from './auth.service';

// Dto
import { RegisterDto } from './dto/register.dto';

// Guard
import JwtAuthGuard from './guard/jwtAuth.guard';
import { LocalAuthGuard } from './guard/localAuth.guard';
import LoginDto from './dto/login.dto';

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

        return user
    }

    @HttpCode(200)
    @Post('login')
    async logIn(@Req() request, @Body() loginData: LoginDto) {
        const { email, password } = loginData;

        let user = await this.authService.getAuthenticatedUser(email, password);
        const token = await this.authService.getJwtToken(user.id);

        request.res.cookie("Authentication", token)
        
        return user
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Res() response: Response) {
        response.cookie("Authentication", null)

        response.sendStatus(200);
    }
}