import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMovieDto } from './dto/update-movie-dto';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';

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
        const movies = await this.movieRepositry.directorsSearch(query);

        if (movies.length === 0) {
          throw new HttpException(
            `${option}해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }
        return movies;
      }

      if (option === 'genreAlt') {
        const movies = await this.movieRepositry.genreAltSearch(query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query} 장르에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'nationAlt') {
        const movies = await this.movieRepositry.nationAltSearch(query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query} 국가에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'openDt') {
        const movies = await this.movieRepositry.openDtSearch(query);

        if (movies.length === 0) {
          throw new HttpException(
            `${query} 년도에 해당하는 영화 목록 조회를 실패했습니다`,
            400,
          );
        }

        return movies;
      }

      if (option === 'movieNm') {
        const movies = await this.movieRepositry.movieNmSearch(query);
        if (movies.length === 0) {
          throw new HttpException(
            `${query}에 해당하는 영화 조회에 실패했습니다`,
            400,
          );
        }

        return movies;
      }
      if (option === 'total') {
        const movies = await this.movieRepositry.moviesSearch();

        return movies;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('영화 조회에 실패하였습니다', 400);
      }
    }
  }

  // 영화 상세 정보 조회
  async getMovieById(movieId: number): Promise<any> {
    const isExistMovie = await this.movieRepositry.getMovieById(movieId);
    if (!isExistMovie) {
      throw new HttpException('존재하지 않는 영화입니다', 400);
    }
    const { posts, ...rest } = isExistMovie;
    const post = posts.length > 0 ? posts[0] : null;
    const detailMovie = { ...rest, post };

    const movieInfo = {
      movieId: isExistMovie.movieId,
      movieNm: isExistMovie.movieNm,
      showTm: isExistMovie.showTm,
      openDt: isExistMovie.openDt,
      nationAlt: isExistMovie.nationAlt,
      genreAlt: isExistMovie.genreAlt,
      directors: isExistMovie.directors.map((dir) => dir.peopleNm),
      actors: isExistMovie.actors.map((actor) => actor.peopleNm),
      watchGradeNm: isExistMovie.watchGradeNm,
      likes: isExistMovie.likes,
      views: isExistMovie.views,
    };

    return movieInfo;
  }

  // 영화 상세 정보 수정하기
  async updateMovieData(
    movieId: number,
    updateMovieDto: UpdateMovieDto,
    auth: any,
  ): Promise<Movie> {
    if (Object.keys(updateMovieDto).length === 0) {
      throw new HttpException('변경할 영화 정보를 입력해주세요', 400);
    }
    const movie = await this.getMovieById(movieId);
    try {
      if (auth === 'admin') {
        const updateMovie = { ...movie, ...updateMovieDto };
        return await this.movieRepositry.updateMovieData(updateMovie);
      } else {
        throw new HttpException('영화 수정에 실패하였습니다', 400);
      }
    } catch (error) {
      throw new HttpException('영화 수정에 실패하였습니다', 400);
    }
  }

  async getLikedMovieList(likedListLength: number) {
    try {
      const Movies = await this.movieRepositry.getLikedMovieList(
        likedListLength,
      );
      const MovieList = Movies.map((movie) => {
        return {
          movieId: movie.movieId,
          movieNm: movie.movieNm,
          directors: movie.directors.map((dir) => dir.peopleNm),
          genreAlt: movie.genreAlt,
          showTm: movie.showTm,
          actors: movie.actors.map((act) => act.peopleNm),
          watchGradeNm: movie.watchGradeNm,
          views: movie.views,
          likes: movie.likes,
        };
      });

      return MovieList;
    } catch (error) {
      throw new HttpException('인기 리스트 조회에 실패했습니다.', 400);
    }
  }
}
