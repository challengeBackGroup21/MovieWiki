import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  // 인기 영화 리스트 조회
  @Get('/like')
  getLikedMovieList(@Query('cnt') likedListLength: number) {
    return this.moviesService.getLikedMovieList(likedListLength);
  }
}
