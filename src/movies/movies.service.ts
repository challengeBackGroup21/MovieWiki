import { HttpException, Injectable } from '@nestjs/common';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MoviesService {
  constructor(private movieRepositry: MovieRepository) {}

  async getLikedMovieList(likedListLength: number) {
    try {
      const Movies = this.movieRepositry.getLikedMovieList(likedListLength);
      return { Movies };
    } catch (error) {
      throw new HttpException('인기 리스트 조회에 실패했습니다.', 400);
    }
  }
}
