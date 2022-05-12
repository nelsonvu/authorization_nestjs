import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import User from 'src/entities/user.entity';
import { UsersService } from '../../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        super({
            usernameField: 'email'
        });
        this.authService = new AuthService(usersService, jwtService, configService)
    }
    async validate(email: string, password: string): Promise<User> {
        return this.authService.getAuthenticatedUser(email, password);
    }
}