import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module
import { SearchModule } from '../search/search.module';
// Controller
import { ProductController } from './product.controller';
// Service
import { ProductService } from './product.service';

// Entity
import Product from '../../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SearchModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
