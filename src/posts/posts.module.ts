import { Module } from '@nestjs/common';
import { MovieRepository } from 'src/movies/movie.repository';
import { PostRepository } from './post.repository';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, MovieRepository],
})
export class PostsModule {}
