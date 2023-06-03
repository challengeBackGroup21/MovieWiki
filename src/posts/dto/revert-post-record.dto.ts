import { IsNotEmpty } from 'class-validator';

export class RevertPostRecordDto {
  @IsNotEmpty()
  comment: string;
}
