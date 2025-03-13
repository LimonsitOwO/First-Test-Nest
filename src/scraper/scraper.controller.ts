import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('linkedin')
  async scrapeLinkedIn(
    @Query('username') username: string,
    @Query('password') password: string
  ) {
    if (!username || !password) {
      return { error: 'Se requiere usuario y contraseña' };
    }
    return await this.scraperService.loginAndGetProfile(username, password);
  }
}
