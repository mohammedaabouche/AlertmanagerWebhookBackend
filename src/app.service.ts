import { Body, Injectable } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';

@Injectable()
export class AppService {
  constructor(
    private telegramService: TelegramService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  getMetris(): string {
    return 'Metrics';
  }

  postMetrics(metrics: string): string {
    return metrics;
  }

  sendAlert(alertData: any): void {
    console.log(
      new Date().toLocaleString() + ' - alerts are being processed. Please wait...',
    );
    try {
      let alerts = alertData.alerts;
      let msg: string = '__';
      if (!alerts) {
        console.log(
          new Date().toLocaleString() + ' - No alerts found :(',
        );
        return;
      }

      alerts.forEach((alert: any) => {
        msg = alert.status ? `Status: ${alert.status} \n` : '';
        msg += alert.labels.cluster
          ? `Cluster: ${alert.labels.cluster} \n`
          : '';
        msg += alert.labels.alertname
          ? `Alertname: ${alert.labels.alertname} \n`
          : '';
        msg += alert.labels.instance
          ? `Instance: ${alert.labels.instance} \n`
          : '';
        msg += alert.labels.job ? `Job: ${alert.labels.job} \n` : '';
        msg += alert.annotations.description
          ? `Description: ${alert.annotations.description} \n`
          : '';
        msg += alert.startsAt ? `Starts At: ${alert.startsAt} \n` : '';

        if (msg != '__') {
          this.telegramService.sendMessage(msg);
          msg = '__';
        }
      });
      console.log(
        new Date().toLocaleString() +
          ' - Alert sent to telegram successfully :)',
      );
    } catch (error) {
      console.error('Error sending alert:', error);
    }
  }
  getAlerts(alertData: any): any {
    let alerts = alertData.alerts;
    if (!alerts) {
      return;
    }
    let customAlerts = [];
    alerts.forEach((alert: any) => {
      customAlerts.push({
        status: alert.status,
        alertname: alert.labels.alertname,
        cluster: alert.labels.cluster,
        instance: alert.labels.instance,
        job: alert.labels.job,
        description: alert.annotations.description,
        startsAt: alert.startsAt,
      });
    });

    return customAlerts;
  }
}
