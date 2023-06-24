import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }
  // async directorsSearch(query: string): Promise<Movie[]> {
  //   const movies = await this.createQueryBuilder('movie')
  //     .where('movie.directors ::text ILIKE :directors', {
  //       directors: `%${query}%`,
  //     })
  //     .take(10000)
  //     .getMany();
  //   return movies;
  // }

  // async genreAltSearch(query: string): Promise<Movie[]> {
  //   const movies = await this.createQueryBuilder('movie')
  //     .where('movie.genreAlt LIKE :genreAlt', { genreAlt: `%${query}%` })
  //     .take(10)
  //     .getMany();

  //   return movies;
  // }

  // async nationAltSearch(query: string): Promise<Movie[]> {
  //   const movies = await this.createQueryBuilder('movie')
  //     .where('movie.nationAlt LIKE :nationAlt', { nationAlt: `%${query}%` })
  //     .take(10000)
  //     .getMany();

  //   return movies;
  // }

  // async openDtSearch(query: string): Promise<Movie[]> {
  //   const movies = await this.createQueryBuilder('movie')
  //     .where('movie.openDt LIKE :openDt', { openDt: `${query}%` })
  //     .take(10000)
  //     .getMany();

  //   return movies;
  // }
  // 동일한 제목의 영화 존재할 수 도 있어서 find로 검색
  // async movieNmSearch(query: string): Promise<any> {
  //   const movies = await this.createQueryBuilder('movie')
  //     .where('movie.movieNm LIKE :movieNm', { movieNm: `%${query}%` })
  //     .take(20)
  //     .getMany();

  //   return movies;
  // }

  // async moviesSearch(query: string): Promise<Movie[]> {
  //   const movies = await this.createQueryBuilder('movie')
  //     .where('movie.directors ::text ILIKE :directors', {
  //       directors: `%${query}%`,
  //     })
  //     .orWhere('movie.movieNm LIKE :movieNm', { movieNm: `%${query}%` })
  //     .orWhere('movie.nationAlt LIKE :nationAlt', { nationAlt: `%${query}%` })
  //     .orWhere('movie.openDt LIKE :openDt', { openDt: `${query}%` })
  //     .orWhere('movie.genreAlt LIKE :genreAlt', { genreAlt: `%${query}%` })
  //     .take(10)
  //     .getMany();
  //   return movies;
  // }

  // 영화 상세 정보 조회,최신 post 연결
  async getMovieById(movieId: number): Promise<any> {
    const isExistMovie = await this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.posts', 'post')
      .where('movie.movieId = :movieId', { movieId })
      .orderBy('post.createdAt', 'DESC')
      .getOne();

    return isExistMovie;
  }

  async incrementMovieView(movieId: number) {
    return await this.increment({ movieId }, 'views', 1);
  }

  async updateMovieData(updateMovie): Promise<Movie> {
    await this.save(updateMovie);
    return updateMovie;
  }

  async findOneMovie(movieId: number) {
    // return await this.findOne({ where: { movieId } });
    return await this.createQueryBuilder('movie')
      .where('movie.movieId = :movieId', { movieId })
      .getOne();
  }

  async getLikedMovieList(likedListLength: number) {
    const likedMovies = await this.createQueryBuilder('movie')
      .orderBy('movie.likes', 'DESC')
      .take(likedListLength)
      .getMany();
    return likedMovies;
  }

  async incrementMovieLike(movieId: number) {
    await this.increment({ movieId }, 'likes', 1);
  }

  async decrementMovieLike(movieId: number) {
    await this.decrement({ movieId }, 'likes', 1);
  }
}
