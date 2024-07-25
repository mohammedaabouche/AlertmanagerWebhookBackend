// Example of using TelegramService in a NestJS controller
import { Controller, Post,Get, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}
  @Get()
  getHello(): string {
    return "e";
  }
  @Post('send-message')
  async sendMessage(@Body() body: { chatId: number; message: string }): Promise<void> {
    const { chatId, message } = body;
    await this.telegramService.sendMessage(message);
  }
    
}
