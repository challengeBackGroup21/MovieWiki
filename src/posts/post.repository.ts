import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { Post } from './post.entity';
import { UpdatePostRecordDto } from './dto/update-post-record.dto';
import { Movie } from 'src/movies/movie.entity';
import { User } from 'src/auth/user.entity';

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
    const existedPost = await manager
      .getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId =:movieId', { movieId: movie.movieId })
      .getOne();

    if (existedPost) {
      throw new HttpException('이미 생성된 기록이 존재합니다', 400);
    }

    const post = new Post();
    post.comment = createPostRecordDto.comment;
    post.content = createPostRecordDto.content;
    post.movie = movie;
    post.user = user;
    post.version = new Date();
    return await manager.save(post);
  }

  async updatePostRecord(
    updatePostRecordDto: UpdatePostRecordDto,
    movieId: number,
    user: User,
    manager: EntityManager,
  ): Promise<Post> {
    const latestPost = await manager
      .getRepository(Post)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .orderBy('post.version', 'DESC')
      .getOne();

    if (
      latestPost.version.getTime() !== updatePostRecordDto.version.getTime()
    ) {
      throw new HttpException('최신 기록이 변경되었습니다', 409);
    }
    const movie = await manager
      .getRepository(Movie)
      .findOne({ where: { movieId } });

    // const user = await manager
    //   .getRepository(User)
    //   .findOne({ where: { userId } });

    const updatePost = new Post();
    updatePost.comment = updatePostRecordDto.comment;
    updatePost.content = updatePostRecordDto.content;
    updatePost.movie = movie;
    updatePost.user = user;
    updatePost.version = new Date();

    console.log(updatePost);
    return await manager.save(updatePost);
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
    previousVersionPost: Post,
    user: User,
  ) {
    const post = new Post();
    post.comment = revertPostRecordDto.comment;
    post.content = previousVersionPost.content;
    post.movie = previousVersionPost.movie;
    post.user = user;
    post.version = new Date();
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
