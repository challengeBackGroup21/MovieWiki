import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  findOneMoive(movieId: number) {
    return this.findOne({ where: { movieId } });
  }

  getLikedMovieList(likedListLength: number) {
    return this.find({ order: { likes: 'DESC' }, take: likedListLength });
  }
}
