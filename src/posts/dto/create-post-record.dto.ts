import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostRecordDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  version: number;
}
