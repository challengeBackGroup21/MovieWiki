import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async findOneMoive(movieId: number) {
    return await this.findOne({ where: { movieId } });
  }

  async getLikedMovieList(likedListLength: number) {
    return await this.find({ order: { likes: 'DESC' }, take: likedListLength });
  }
}
