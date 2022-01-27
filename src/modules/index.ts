import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { UsersModule } from './user/users.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      {
        path: '/users',
        module: UsersModule,
      },
    ],
  },
];

@Module({
  imports: [
    UsersModule,
    RouterModule.register(routes), // setup the routes
  ], // as usual, nothing new
  controllers: [],
  providers: [],
})
export class ApplicationModule {
  constructor() {
    console.log('app');
  }
}
