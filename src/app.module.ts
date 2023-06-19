import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import * as config from 'config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { testTypeORMConfig, typeORMConfig } from './configs/typeorm.config';
import { CurrentSnapshotModule } from './current-snapshot/current-snapshot.module';
import { LikesModule } from './likes/likes.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MoviesModule } from './movies/movies.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { SnapshotModule } from './snapshot/snapshot.module';
const redisConfig = config.get('redis');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `./config/${process.env.NODE_ENV || 'development'}.yml`,
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: redisConfig.host,
        port: redisConfig.port,
        username: redisConfig.username,
        password: redisConfig.password,
        ttl: 5,
      }),
    }),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'test' ? testTypeORMConfig : typeORMConfig,
    ),
    AuthModule,
    LikesModule,
    MoviesModule,
    NotificationsModule,
    PostsModule,
    SnapshotModule,
    CurrentSnapshotModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
