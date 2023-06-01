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
import { PostService } from './posts.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  // @UseGuards() 로그인 가드 사용
  // 영화 상세 수정 기록 생성
  @Post('/:movieId/record')
  @UseGuards(AccessTokenGuard)
  createPostRecord(
    @Body() createMovieRecordDto: CreatePostRecordDto,
    @Param('movieId') movieId: number,
    @GetCurrentUser() user: any,
  ) {
    return this.postService.createPostRecord(
      createMovieRecordDto,
      movieId,
      user.userId,
    );
  }

  // 영화 상세 수정 기록 조회
  @Get('/:movieId/record/:postId')
  getOnePostRecord(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.getOnePostRecord(movieId, postId);
  }

  // 영화 상세 수정 기록 전체 조회
  @Get('/:movieId/record')
  getPostRecords(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.postService.getPostRecords(movieId);
  }

  @Get('/post-test')
  @UseGuards(AccessTokenGuard)
  postTest(@GetCurrentUser() user) {
    console.log('user', user);
  }
}
