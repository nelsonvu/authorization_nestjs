import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cats.interface';

@Controller('cats')
export class CatsController {
  private readonly logger = new Logger(CatsController.name)
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    let cats = this.catsService.findAll();
    this.logger.log("Get all cats successfully")
    return cats
  }
}