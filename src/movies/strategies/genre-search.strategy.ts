import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { Movie } from '../movie.entity';
// import { MovieRepository } from '../movie.repository';
import { SearchStrategy } from './search-strategy.interface';

export class GenreSearch implements SearchStrategy {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async search(query: string): Promise<any> {
    console.log('strategy', query);

    const { body } = await this.elasticSearchService.search({
      index: 'new_movies',
      body: {
        query: {
          match: {
            genreAlt: query,
          },
        },
        size: 1000,
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
