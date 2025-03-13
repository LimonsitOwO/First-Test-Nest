import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User],
      synchronize: true,
    }),
    UsersModule, 
    DatabaseModule, ScraperModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
