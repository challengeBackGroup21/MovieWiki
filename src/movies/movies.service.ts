import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { UpdateMovieDto } from './dto/update-movie-dto';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';
import { DirectorsSearch } from './strategies/directors-search.strategy';
import { GenreSearch } from './strategies/genre-search.strategy';
import { MovieSearch } from './strategies/movie-search.strategy';
import { NationSearch } from './strategies/nation-search.strategy';
import { OpenSearch } from './strategies/open-search.strategy';
import { SearchStrategy } from './strategies/search-strategy.interface';
import { TotalSearch } from './strategies/total-search.strategy';

@Injectable()
export class MoviesService {
  // ex) searchStrategies: {'directors': new DirectorsSearch(elasticsearchService)}
  private searchStrategies: { [key: string]: SearchStrategy } = {};
  constructor(
    @InjectRepository(MovieRepository)
    private movieRepositry: MovieRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRedis() private readonly redis: Redis,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    this.saveStrategy('directors', new DirectorsSearch(elasticsearchService));
    this.saveStrategy('genreAlt', new GenreSearch(elasticsearchService));
    this.saveStrategy('openDt', new OpenSearch(elasticsearchService));
    this.saveStrategy('nationAlt', new NationSearch(elasticsearchService));
    this.saveStrategy('movieNm', new MovieSearch(elasticsearchService));
    this.saveStrategy('total', new TotalSearch(elasticsearchService));
  }
  // searchStrategies의 option(key)에 해당하는 검색전략을 추가
  saveStrategy(option: string, searchStrategy: SearchStrategy) {
    this.searchStrategies[option] = searchStrategy;
  }
  // option에 따라 검색하기

  async search(option: string, query: string): Promise<Movie[]> {
    const searchStrategy = this.searchStrategies[option];
    const movies = await searchStrategy.search(query);
    if (movies.length === 0) {
      throw new HttpException(
        `${query}에 해당하는 영화 목록 조회를 실패했습니다`,
        400,
      );
    }
    return movies;
  }

  async getIsViewed(userIp: string, movieId: number) {
    try {
      const isViewed = await this.cacheManager.get(
        `viewed/${movieId}/${userIp}`,
      );

      if (!isViewed) {
        this.cacheManager.set(`viewed/${movieId}/${userIp}`, 'true', 100);
        const increaseView = await this.movieRepositry.incrementMovieView(
          movieId,
        );
      }

      const movie_score = await this.redis.zscore('rank', `${movieId}`);
      await this.redis.zadd('rank', Number(movie_score) + 1, `${movieId}`);
      // await this.redis.expire('rank', 900);

      return 'view checked';
    } catch (error) {
      throw new HttpException('영화 조회 여부 조회에 실패했습니다.', 400);
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
      imageUrl: isExistMovie.imageUrl,
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

  async getLikedMovieList() {
    try {
      const realTimePopularRankTopFive = await this.redis.zrevrange(
        'rank',
        0,
        4,
      );
      const realTimePopularMovies = [];
      for (const movieId of realTimePopularRankTopFive) {
        const movie = await this.movieRepositry.findOneMovie(Number(movieId));
        realTimePopularMovies.push(movie);
      }

      const MovieList = realTimePopularMovies.map((movie) => {
        const directors = movie.directors.map((dir) => dir.peopleNm);
        const actors = movie.actors.map((act) => act.peopleNm);

        return {
          movieId: movie.movieId,
          movieNm: movie.movieNm,
          directors: directors,
          genreAlt: movie.genreAlt,
          showTm: movie.showTm,
          actors: actors,
          watchGradeNm: movie.watchGradeNm,
          imageUrl: movie.imageUrl,
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
