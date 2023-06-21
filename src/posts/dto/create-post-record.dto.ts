import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthUser } from '../../auth/dto/auth-user.oo';
import { QueryRunner } from 'typeorm';

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

export class CreatePostOo {
  @IsNotEmpty()
  createPostRecordDto: CreatePostRecordDto;

  @IsOptional()
  movieId: number;

  @IsOptional()
  user: AuthUser;

  @IsOptional()
  queryRunner: QueryRunner;
}
