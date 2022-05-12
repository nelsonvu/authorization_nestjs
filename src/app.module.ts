import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CatsModule } from './modules/cat/cats.module';
import LoggerMiddleware from './configs/middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/log/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthModuleOptions } from '@nestjs/passport';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';

@Module({
  imports: [
    CatsModule,
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // PostgresQL
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        // Port server
        PORT: Joi.number(),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    }),
    DatabaseModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}