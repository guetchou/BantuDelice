import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('sms')
  @ApiOperation({ summary: 'Send SMS notification' })
  async sendSMS(@Body() body: { phoneNumber: string; message: string }) {
    await this.notificationsService.sendSMS(body.phoneNumber, body.message);
    return { message: 'SMS notification queued' };
  }

  @Post('email')
  @ApiOperation({ summary: 'Send email notification' })
  async sendEmail(@Body() body: { email: string; subject: string; message: string }) {
    await this.notificationsService.sendEmail(body.email, body.subject, body.message);
    return { message: 'Email notification queued' };
  }

  @Post('push')
  @ApiOperation({ summary: 'Send push notification' })
  async sendPush(@Body() body: { userId: string; title: string; message: string; data?: any }) {
    await this.notificationsService.sendPushNotification(body.userId, body.title, body.message, body.data);
    return { message: 'Push notification queued' };
  }
} 