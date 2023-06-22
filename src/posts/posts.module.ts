import { Module } from '@nestjs/common';
import { MovieRepository } from '../movies/movie.repository';
import { PostRepository } from './post.repository';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { Snapshot } from '../snapshot/snapshot.entity';
import { SnapshotRepository } from '../snapshot/snapshot.repository';
import { CurrentSnapshotRepository } from '../current-snapshot/current-snapshot.repository';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    MovieRepository,
    SnapshotRepository,
    CurrentSnapshotRepository,
  ],
})
export class PostsModule {}
