import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { Post } from './post.entity';
import { UpdatePostRecordDto } from './dto/update-post-record.dto';
import { ProcessedPost } from './types/process-post.type';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async createPostRecord(
    createPostRecordDto: CreatePostRecordDto,
    movieId: number,
    userId: any,
    //version
    // req.user.userId, 유저 정보
  ) {
    const post = new Post();
    post.comment = createPostRecordDto.comment;
    post.content = createPostRecordDto.content;
    post.movieId = movieId;
    post.user.userId = userId;
    post.version = new Date();
    return await this.save(post);
  }

  async updatePostRecord(
    updatePostRecordDto: UpdatePostRecordDto,
    movieId: number,
    userId: any,
  ) {
    const updatePost = new Post();
    updatePost.comment = updatePostRecordDto.comment;
    updatePost.content = updatePostRecordDto.content;
    updatePost.movieId = movieId;
    updatePost.userId = userId;
    updatePost.version = new Date();
    return await this.save(updatePost);
  }

  // findOne으로 movieId를 찾을려하니 Post에 movieId가 실제로 존재하지 않아서
  // Post에 movieId를 찾을 수 없다라는 에러 발생
  // createQueryBuilder로 join하여 해결
  async getLatestPostRecord(movieId: number): Promise<Post> {
    const latestPost = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .orderBy('post.version', 'DESC')
      .getOne();

    return latestPost;
  }

  async getOnePostRecord(movieId: number, postId: number): Promise<Post> {
    const post = await this.findOne({
      where: { postId },
      relations: ['movie', 'user'],
    });
    console.log(post);
    return post;
  }

  async getPostRecords(movieId: number) {
    const posts = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .orderBy('post.version', 'DESC')
      .getMany();

    console.log(posts);
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
    post.user.userId = userId;
    post.version = new Date();
    return await this.save(post);
  }

  // 신고할 때 해당 post 작성자 id를 찾기 위해 post 테이블에서 postId를 기준으로 userId를 찾는다.
  async findReportedId(postId: number) {
    const notificationPost = await this.findOne({
      where: { postId },
      relations: ['userId'],
    });

    return notificationPost.user.userId;
  }
}
