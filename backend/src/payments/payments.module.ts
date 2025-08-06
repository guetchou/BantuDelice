import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MTNMoMoService } from './mtn-momo.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, MTNMoMoService],
  exports: [PaymentsService, MTNMoMoService],
})
export class PaymentsModule {} 