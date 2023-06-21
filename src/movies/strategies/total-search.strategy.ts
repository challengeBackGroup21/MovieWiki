import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Movie } from '../movie.entity';
// import { MovieRepository } from '../movie.repository';
import { SearchStrategy } from './search-strategy.interface';

export class TotalSearch implements SearchStrategy {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async search(query: string): Promise<Movie[]> {
    console.log('strategy', query);

    const { body } = await this.elasticSearchService.search({
      index: 'new_movies',
      body: {
        query: {
          bool: {
            should: [
              // 주어진 조건 중, 하나 이상 만족하면 검색 결과에 포함, 반환 순서 _score에 의해 결정
              {
                multi_match: {
                  // 여러개의 필드에서 동일한 query로 검색할 때 사용
                  query: query,
                  fields: [
                    'directors.peopleNm',
                    'nationAlt',
                    'genreAlt',
                    'movieNm',
                  ],
                },
              },
              {
                prefix: {
                  openDt: {
                    value: query,
                    boost: 30.0, // 반환 순서 _score순, 1998을 검색했을 시, openDt가 먼저 정렬되도록 정렬순서 조정
                  },
                },
              },
            ],
            minimum_should_match: 1, // 적어도 하나의 조건은 만족해야 한다.
          },
        },
        size: 1000,
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
    // return body.hits.hits;
  }
}

// export class TotalSearch implements SearchStrategy {
//   constructor(private readonly movieRepository: MovieRepository) {}

//   async search(query: string): Promise<Movie[]> {
//     return this.movieRepository.moviesSearch(query);
//   }
// }
