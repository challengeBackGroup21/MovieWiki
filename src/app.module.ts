import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { MoviesModule } from './movies/movies.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    AuthModule,
    LikesModule,
    MoviesModule,
    NotificationsModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
