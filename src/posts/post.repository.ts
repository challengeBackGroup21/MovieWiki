import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Movie } from 'src/movies/movie.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { CreatePostRecordDto } from './dto/create-post-record.dto';
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
    content: string,
  ) {
    console.log('content 있냐?', content);
    const post = new Post();

    post.comment = createPostRecordDto.comment;
    post.content = content;
    post.movie = movie;
    post.user = user;

    // createPostRecordDto의 version으로 해줄까?

    const latestPost = await manager
      .getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId: movie.movieId })
      .orderBy('post.version', 'DESC')
      .getOne();

    if (!latestPost) {
      // 최초 생성인 경우
      post.version = 1;
    } else {
      // 최초 생성이 아닌 경우
      post.version = latestPost.version + 1;
    }

    await manager.save(post);
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

  /* 특정 버전으로 롤백할 때 */
  async findDiffsByVersion(movieId: number, version: number) {
    const snapshotVersion = Math.floor(version / 10) * 10 + 1;

    const posts = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .andWhere('post.version >= :minVersion AND post.version <= :maxVersion', {
        minVersion: snapshotVersion + 1,
        maxVersion: version,
      })
      .getMany();

    const diffs = posts.map((post) => JSON.parse(post.content));

    return diffs;
  }

  async findPostByVersion(movieId: number, version: number) {
    const post = await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .andWhere('post.version = :version', { version })
      .getOne();

      return post;
  };
}
