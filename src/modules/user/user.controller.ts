import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller()
export class UserController {
  constructor() {
    console.log('55555', VERSION_NEUTRAL);
  }

  @Get('')
  getHello() {
    console.log('777');
  }
}
