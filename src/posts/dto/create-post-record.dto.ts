import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreatePostRecordDto {
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  comment: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  version: Date;
}
