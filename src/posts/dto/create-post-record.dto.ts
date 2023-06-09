import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostRecordDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  // @IsString()
  // version: string;
}
