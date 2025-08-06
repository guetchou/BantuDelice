import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';
import { CallCenterTicket } from './entities/call-center-ticket.entity';
import { CallCenterAgent } from './entities/call-center-agent.entity';
import { CallCenterChannel } from './entities/call-center-channel.entity';
import { CallCenterOrder } from './entities/call-center-order.entity';
import { CallCenterNotification } from './entities/call-center-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CallCenterTicket,
      CallCenterAgent,
      CallCenterChannel,
      CallCenterOrder,
      CallCenterNotification,
    ]),
  ],
  controllers: [CallCenterController],
  providers: [CallCenterService],
  exports: [CallCenterService],
})
export class CallCenterModule {} 