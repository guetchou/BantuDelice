import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface NotificationData {
  type: 'sms' | 'email' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async sendNotification(notification: NotificationData) {
    await this.notificationsQueue.add('send', notification, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async sendSMS(phoneNumber: string, message: string) {
    await this.sendNotification({
      type: 'sms',
      recipient: phoneNumber,
      message,
    });
  }

  async sendEmail(email: string, subject: string, message: string) {
    await this.sendNotification({
      type: 'email',
      recipient: email,
      subject,
      message,
    });
  }

  async sendPushNotification(userId: string, title: string, message: string, data?: any) {
    await this.sendNotification({
      type: 'push',
      recipient: userId,
      subject: title,
      message,
      data,
    });
  }
} 