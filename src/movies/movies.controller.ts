import {
  Controller,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { UpdateMovieDto } from './dto/update-movie-dto';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  // 영화 검색
  @Get('search')
  search(
    @Query('option') option: string,
    @Query('query') query: string,
  ): Promise<Movie[]> {
    return this.moviesService.search(option, query);
  }

  // 영화 상세 정보 검색
  @Get('/:movieId')
  getMovieById(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<Movie> {
    return this.moviesService.getMovieById(movieId);
  }

  // 영화 상세 정보 수정
  // @UserGuards()
  @Patch('/:movieId')
  updateMovieData(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() updateMovieData: UpdateMovieDto,
  ): Promise<Movie> {
    return this.moviesService.updateMovieData(movieId, updateMovieData);
  }
  // 인기 영화 리스트 조회
  @Get('/like')
  getLikedMovieList(@Query('cnt', ParseIntPipe) likedListLength: number) {
    return this.moviesService.getLikedMovieList(likedListLength);
  }
}
