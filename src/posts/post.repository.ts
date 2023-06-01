import { Injectable } from '@nestjs/common';
import { Movie } from 'src/movies/movie.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }

  async createPostRecord(
    createPostRecordDto: CreatePostRecordDto,
    joinnedMovie: Movie,
    userId: any,
    // req.user.userId, 유저 정보
  ) {
    const post = new Post();
    post.comment = createPostRecordDto.comment;
    post.content = createPostRecordDto.content;
    post.movie = joinnedMovie;
    post.user = userId;
    post.version = new Date();
    return await this.save(post);
  }

  async getOnePostRecord(movieId: number, postId: number) {
    const post = await this.createQueryBuilder('Post')
      .leftJoinAndSelect('Post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId: movieId })
      .andWhere('Post.postId = :postId', { postId: postId })
      .getOne();
    console.log(post);
    return post;
  }

  async getPostRecords(movieId: number) {
    const posts = await this.createQueryBuilder('Post')
      .leftJoinAndSelect('Post.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId: movieId })
      .getMany();
    console.log(posts);
    return posts;
  }
}
