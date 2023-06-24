import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Movie } from '../movie.entity';
// import { MovieRepository } from '../movie.repository';
import { SearchStrategy } from './search-strategy.interface';

export class GenreSearch implements SearchStrategy {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async search(query: string): Promise<Movie[]> {
    console.log('strategy', query);

    const { body } = await this.elasticSearchService.search({
      index: 'ngram_movies',
      body: {
        query: {
          match: {
            genreAlt: query,
          },
        },
        size: 10,
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}

// export class GenreSearch implements SearchStrategy {
//   constructor(private readonly movieRepository: MovieRepository) {}

//   async search(query: string): Promise<Movie[]> {
//     return this.movieRepository.genreAltSearch(query);
//   }
// }
