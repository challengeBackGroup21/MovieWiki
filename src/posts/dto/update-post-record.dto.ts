import { IsDate, IsNotEmpty } from 'class-validator';
import { CreatePostRecordDto } from './create-post-record.dto';
import { Type } from 'class-transformer';

export class UpdatePostRecordDto extends CreatePostRecordDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  version: Date;
}
