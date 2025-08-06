import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService, PaymentRequest } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process payment' })
  async processPayment(@Body() paymentRequest: PaymentRequest) {
    return this.paymentsService.processPayment(paymentRequest);
  }
} 