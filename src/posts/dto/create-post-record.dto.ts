import { IsNotEmpty } from 'class-validator';

export class CreatePostRecordDto {
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  comment: string;
}
