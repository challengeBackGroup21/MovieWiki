import { Module } from '@nestjs/common';
import { MovieRepository } from 'src/movies/movie.repository';
import { PostRepository } from './post.repository';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { Snapshot } from 'src/snapshot/snapshot.entity';
import { SnapshotRepository } from 'src/snapshot/snapshot.repository';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, MovieRepository, SnapshotRepository],
})
export class PostsModule {}
