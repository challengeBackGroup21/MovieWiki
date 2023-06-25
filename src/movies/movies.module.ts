import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import redisStore from 'cache-manager-ioredis';
import config from 'config';
import { Movie } from './movie.entity';
import { MovieRepository } from './movie.repository';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

const redisConfig = config.get('redis');

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: redisConfig.host,
        port: redisConfig.port,
        username: redisConfig.username,
        password: redisConfig.password,
        ttl: 900,
      }),
    }),
    RedisModule.forRoot({
      config: {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
      },
    }),
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
