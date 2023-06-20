import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { Movie } from '../movie.entity';
// import { MovieRepository } from '../movie.repository';
import { SearchStrategy } from './search-strategy.interface';

export class OpenSearch implements SearchStrategy {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async search(query: string): Promise<any> {
    const { body } = await this.elasticSearchService.search({
      index: 'new_movies',
      body: {
        query: {
          prefix: {
            // 필드의 특정 접두사가 포함된 문서 반환
            //ex) query가 "2016"이라면, "2016"으로 시작하는 모든 문서 반환
            openDt: query,
          },
        },
        size: 1000,
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}

// export class OpenSearch implements SearchStrategy {
//   constructor(private readonly movieRepository: MovieRepository) {}

//   async search(query: string): Promise<Movie[]> {
//     return this.movieRepository.openDtSearch(query);
//   }
// }
