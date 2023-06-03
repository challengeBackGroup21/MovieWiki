import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async createPostRecord(
    createPostRecordDto: CreatePostRecordDto,
    movieId: number,
    userId: any,
    // req.user.userId, 유저 정보
  ) {
    const post = new Post();
    post.comment = createPostRecordDto.comment;
    post.content = createPostRecordDto.content;
    post.movieId = movieId;
    post.userId = userId;
    post.version = new Date();
    return await this.save(post);
  }

  async getOnePostRecord(movieId: number, postId: number) {
    const post = await this.findOne({
      where: { postId, movieId },
      relations: ['movieId', 'userId'],
    });
    console.log(post);
    return post;
  }

  async getPostRecords(movieId: number) {
    const posts = await this.find({
      where: { movieId },
      relations: ['userId'],
      order: { createdAt: 'DESC' },
    });
    return posts;
  }

  async revertPostRecord(
    revertPostRecordDto: RevertPostRecordDto,
    result,
    movieId,
    userId: any,
  ) {
    const post = new Post();
    post.comment = revertPostRecordDto.comment;
    post.content = result.content;
    post.movieId = movieId;
    post.userId = userId;
    post.version = new Date();
    return await this.save(post);
  }

  // 신고할 때 해당 post 작성자 id를 찾기 위해 post 테이블에서 postId를 기준으로 userId를 찾는다.
  async findReportedId(postId: number) {
    const notificationPost = await this.findOne({
      where: { postId },
      relations: ['userId'],
    });

    return notificationPost.userId.userId;
  }
}
