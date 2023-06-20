import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    ElasticsearchModule.register({
      node: 'http://13.124.152.252:9200',
      // maxRetries: 10,
      // requestTimeout: 60000,
      // pingTimeout: 60000,
      // sniffOnStart: true,
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieRepository],
  exports: [MoviesService, MovieRepository],
})
export class MoviesModule {}
