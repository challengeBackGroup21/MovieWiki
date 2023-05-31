import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }
  async directorsSearch(option: string, query: string): Promise<Movie[]> {
    const movies = await this.createQueryBuilder('movie')
      .where('movie.directors @> :directors', {
        directors: JSON.stringify([{ peopleNm: query }]),
      })
      .getMany();
    return movies;
  }

  async genreAltSearch(option: string, query: string): Promise<Movie[]> {
    const movies = await this.createQueryBuilder('movie')
      .where('movie.genreAlt LIKE :genreAlt', { genreAlt: `%${query}%` })
      .getMany();

    return movies;
  }

  async nationAltSearch(option: string, query: string): Promise<Movie[]> {
    const movies = await this.createQueryBuilder('movie')
      .where('movie.nationAlt LIKE :nationAlt', { nationAlt: `%${query}%` })
      .getMany();

    return movies;
  }

  async openDtSearch(option: string, query: string): Promise<Movie[]> {
    const movies = await this.createQueryBuilder('movie')
      .where('movie.openDt LIKE :openDt', { openDt: `${query}%` })
      .getMany();

    return movies;
  }

  async movieNmSearch(option: string, query: string): Promise<Movie[]> {
    const movies = await await this.find({
      where: { movieNm: query },
    });

    return movies;
  }

  async getMovieById(movieId: number): Promise<Movie> {
    const isExistMovie = await this.findOne({
      where: { movieId },
    });

    return isExistMovie;
  }

  async updateMovieData(updateMovie): Promise<Movie> {
    await this.save(updateMovie);
    return updateMovie;
  }

  async findOneMoive(movieId: number) {
    return await this.findOne({ where: { movieId } });
  }

  async getLikedMovieList(likedListLength: number) {
    return await this.find({ order: { likes: 'DESC' }, take: likedListLength });
  }
}
