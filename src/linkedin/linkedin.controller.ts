import { Controller, Post, Body, Get } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';

@Controller('linkedin')
export class LinkedinController {
  constructor(private readonly linkedInService: LinkedinService) {}

  @Post()
  async getLinkedInData(@Body() credentials: { email: string; password: string }) {
    return this.linkedInService.signInAndScrapeProfile(credentials.email, credentials.password);
  }
}