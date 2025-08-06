import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateColisDto {
  @IsOptional()
  @IsString()
  userId?: string;
  @IsString()
  senderName: string;

  @IsString()
  senderPhone: string;

  @IsString()
  senderAddress: string;

  @IsString()
  senderCity: string;

  @IsString()
  senderCountry: string;

  @IsString()
  recipientName: string;

  @IsString()
  recipientPhone: string;

  @IsString()
  recipientAddress: string;

  @IsString()
  recipientCity: string;

  @IsString()
  recipientCountry: string;

  @IsString()
  packageType: string;

  @IsOptional()
  @IsString()
  packageDescription?: string;

  @IsNumber()
  weightKg: number;

  @IsOptional()
  @IsNumber()
  lengthCm?: number;

  @IsOptional()
  @IsNumber()
  widthCm?: number;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsString()
  deliverySpeed: string;

  @IsOptional()
  @IsString()
  deliveryInstructions?: string;

  @IsOptional()
  @IsNumber()
  insuranceAmount?: number;

  @IsOptional()
  @IsBoolean()
  isInternational?: boolean;

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsNumber()
  recipientLatitude?: number;

  @IsOptional()
  @IsNumber()
  recipientLongitude?: number;
} 