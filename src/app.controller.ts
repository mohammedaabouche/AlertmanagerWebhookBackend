import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  metrics: string;
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('Metrics')
  getMetrics(): string {
    
    return this.metrics;
  }
  @Post('alerts')
  receiveAlert(@Body() alertData: any): string {
    // Process alertData as needed
    console.log('Received alert');
    this.metrics = alertData;
    this.appService.sendAlert(alertData);
    // Assuming you want to return a confirmation message
    return 'Alert received and processed successfully!';
  }

  @Get('webhook')
  webhook(): any {
    return this.appService.getAlerts(this.metrics);
  }
}

