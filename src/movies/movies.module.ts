import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import * as config from 'config';
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
        ttl: 3600,
      }),
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieRepository],
  exports: [MoviesService, MovieRepository],
})
export class MoviesModule {}
