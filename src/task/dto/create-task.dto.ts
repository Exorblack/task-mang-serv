import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsOptional()
  @IsBoolean()
  readonly completed?: boolean;

  @IsOptional()
  @IsDateString()
  readonly Date?: Date;

}
