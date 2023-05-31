import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './movie.entity';
import { UpdateMovieDto } from './dto/update-movie-dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepositry: MovieRepository,
  ) {}

  // option에 따라 검색하기
  async search(option: string, query: string): Promise<Movie[]> {
    try {
      if (option === 'directors') {
        // QueryBuilder를 사용하여 directors 필드 내의 peopleNm을 검색
        const movies = await this.movieRepositry.directorsSearch(option, query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query}감독님에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'genreAlt') {
        const movies = await this.movieRepositry.genreAltSearch(option, query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query} 장르에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'nationAlt') {
        const movies = await this.movieRepositry.nationAltSearch(option, query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query} 국가에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'openDt') {
        const movies = await this.movieRepositry.openDtSearch(option, query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query} 년도에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'movieNm') {
        // 동일한 제목의 영화 존재할 수 도 있어서 find로 검색
        const movies = await this.movieRepositry.movieNmSearch(option, query);
        if (movies.length === 0) {
          throw new HttpException(
            `${query}에 해당하는 영화 조회에 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      // if (!option) {
      //   const movies = await this.movieRepositry.find({
      //     order: {
      //       movieId: 'ASC',
      //     },
      //     take: 20,
      //   });

      //   return movies;
      // } else {
      //   throw new HttpException('영화 조회에 실패하였습니다', 400);
      // }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('영화 조회에 실패하였습니다', 400);
      }
    }
  }

  // 영화 상세 정보 검색하기
  async getMovieById(movieId: number): Promise<Movie> {
    const isExistMovie = await this.movieRepositry.getMovieById(movieId);

    if (!isExistMovie) {
      throw new HttpException('존재하지 않는 영화입니다', 400);
    }

    return isExistMovie;
  }

  // 영화 상세 정보 수정하기
  async updateMovieData(
    movieId: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    if (Object.keys(updateMovieDto).length === 0) {
      throw new HttpException('변경할 영화 정보를 입력해주세요', 400);
    }
    const movie = await this.getMovieById(movieId);
    const updateMovie = { ...movie, ...updateMovieDto };

    return await this.movieRepositry.save(updateMovie);
  }

  async getLikedMovieList(likedListLength: number) {
    try {
      const Movies = this.movieRepositry.getLikedMovieList(likedListLength);
      return Movies;
    } catch (error) {
      throw new HttpException('인기 리스트 조회에 실패했습니다.', 400);
    }
  }
}
