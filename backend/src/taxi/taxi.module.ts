import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxiController } from './taxi.controller';
import { TaxiService } from './taxi.service';
import { TaxiGateway } from './taxi-gateway';
import { TaxiRide } from './entities/taxi-ride.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Pricing } from './entities/pricing.entity';
import { Driver } from '../tracking/entities/driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaxiRide, Vehicle, Pricing, Driver]),
  ],
  controllers: [TaxiController],
  providers: [TaxiService, TaxiGateway],
  exports: [TaxiService],
})
export class TaxiModule {} 