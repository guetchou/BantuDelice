import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColisController } from './colis.controller';
import { ColisService } from './colis.service';
import { TarificationController } from './tarification.controller';
import { TarificationService } from './tarification.service';
import { Colis } from './entities/colis.entity';
import { Tracking } from './entities/tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colis, Tracking])],
  controllers: [ColisController, TarificationController],
  providers: [ColisService, TarificationService],
  exports: [ColisService, TarificationService],
})
export class ColisModule {} 