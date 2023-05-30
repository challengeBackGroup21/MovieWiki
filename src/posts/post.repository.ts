import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  //   async createMovieRecord(
  //     createPostRecordDto: CreatePostRecordDto,
  //     movieId: number,
  //     // req.user.userId, 유저 정보
  //   ) {
  //     return this.create({
  //       ...createPostRecordDto,
  //       movieId,
  //       // req.user.userId 유저 정보 추가
  //     });
  //   }

  //   async getOnePostRecord(movieId: number, postId: number) {
  //     return this.findOne({ where: { movieId: movieId, postId: postId } });
  //   }

  //   async getPostRecords(movieId: number) {
  //     return this.find({ where: { movieId } });
  //   }
}
