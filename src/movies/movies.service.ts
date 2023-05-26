import { Injectable } from '@nestjs/common';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MoviesService {
  constructor(private movieRepositry: MovieRepository) {}
  //   async createMovieRecord(
  //     createMovieRecordDto: CreateMovieRecordDto,
  //     movieId: number,
  //   ) {}
}
