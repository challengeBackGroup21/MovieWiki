import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Movie } from '../movie.entity';
// import { MovieRepository } from '../movie.repository';
import { SearchStrategy } from './search-strategy.interface';

export class DirectorsSearch implements SearchStrategy {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async search(query: string): Promise<Movie[]> {
    console.log('strategy', query);

    const { body } = await this.elasticSearchService.search({
      index: 'new_movies',
      body: {
        query: {
          match: {
            // 쿼리 문자열을 분석하고, 분석한 결과 중 하나라도 일치하는 token의 문서를 가져옴
            // 분석 기준: 해당 필드에 연결된 분석기
            'directors.peopleNm': query,
          },
        },
        size: 10,
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}

// export class DirectorsSearch implements SearchStrategy {
//   constructor(private readonly movieRepository: MovieRepository) {}

//   async search(query: string): Promise<Movie[]> {
//     return this.movieRepository.directorsSearch(query);
//   }
// }
