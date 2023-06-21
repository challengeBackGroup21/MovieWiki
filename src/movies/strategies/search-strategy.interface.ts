import { Movie } from '../movie.entity';

export interface SearchStrategy {
  search(query: string): Promise<Movie[]>;
}
