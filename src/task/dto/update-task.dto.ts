import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsBoolean()
  readonly completed?: boolean;

  @IsOptional()
  @IsDateString()
  readonly Date?: Date;
}