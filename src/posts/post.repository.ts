import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Movie } from 'src/movies/movie.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    movie: Movie,
    user: User,
    manager: EntityManager,
  ): Promise<Post> {
    const post = new Post();
    post.comment = createPostRecordDto.comment;
    post.content = createPostRecordDto.content;
    post.movie = movie;
    post.user = user;
    const latestPost = await this.getLatestPostRecord(movie.movieId);
    post.version = latestPost.version + 1;
    return await manager.save(post);
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
    // console.log(latestPost);
    return latestPost;
  }

  async getOnePostRecord(movieId: number, postId: number): Promise<Post> {
    const post = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .andWhere('post.postId = :postId', { postId })
      .getOne();
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
    previousVersionPost: Post,
    user: User,
  ) {
    const post = new Post();
    post.comment = revertPostRecordDto.comment;
    post.content = previousVersionPost.content;
    post.movie = previousVersionPost.movie;
    post.user = user;
    const latestPost = await this.getLatestPostRecord(
      previousVersionPost.movieId,
    );
    post.version = latestPost.version + 1;
    return await this.save(post);
  }

  async findReportedId(postId: number) {
    const post = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('post.postId = :postId', { postId })
      .getOne();

    console.log(post);
    return post.userId;
  }

  async findMovieId(postId: number) {
    const post = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('post.postId = :postId', { postId })
      .getOne();

    console.log(post);
    return post.movieId;
  }
}
