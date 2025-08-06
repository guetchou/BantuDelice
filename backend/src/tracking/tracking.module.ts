import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TrackingGateway } from './tracking.gateway';
import { Tracking } from './entities/tracking.entity';
import { Driver } from './entities/driver.entity';
import { Colis } from '../colis/entities/colis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tracking, Driver, Colis])
  ],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingGateway],
  exports: [TrackingService, TrackingGateway]
})
export class TrackingModule {} 