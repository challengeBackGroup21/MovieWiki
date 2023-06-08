import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/auth/common/decorators';
import { AccessTokenGuard } from 'src/auth/guards';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { PostService } from './posts.service';
import { ProcessedPost } from './types/process-post.type';

import { User } from 'src/auth/user.entity';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  // @UseGuards() 로그인 가드 사용
  // 영화 상세 기록 생성 및 수정
  @Post('/:movieId/record')
  @UseGuards(AccessTokenGuard)
  createPostRecord(
    @Body() createMovieRecordDto: CreatePostRecordDto,
    @Param('movieId') movieId: number,
    @GetCurrentUser() user: User,
  ) {
    return this.postService.createPostRecord(
      createMovieRecordDto,
      movieId,
      user,
    );
  }

  // 영화 최신 버전 기록 조회
  @Get('/:movieId/record/latest')
  getLatestPostRecord(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<ProcessedPost> {
    return this.postService.getLatestPostRecord(movieId);
  }

  // 영화 상세 수정 기록 조회
  @Get('/:movieId/record/:postId')
  getOnePostRecord(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<ProcessedPost> {
    return this.postService.getOnePostRecord(movieId, postId);
  }

  // 영화 상세 수정 기록 전체 조회
  @Get('/:movieId/record')
  getPostRecords(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<ProcessedPost[]> {
    return this.postService.getPostRecords(movieId);
  }
  // 영화 기록 이전 버전 다시 생성
  @Post('/:movieId/record/:postId')
  @UseGuards(AccessTokenGuard)
  revertPostRecord(
    @Body() revertPostRecordDto: RevertPostRecordDto,
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @GetCurrentUser() user: User,
  ) {
    return this.postService.revertPostRecord(
      revertPostRecordDto,
      movieId,
      postId,
      user,
    );
  }
}
