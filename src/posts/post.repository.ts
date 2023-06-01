import { Injectable } from '@nestjs/common';
import { Movie } from 'src/movies/movie.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { Post } from './post.entity';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';

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

  async revertPostRecord(revertPostRecordDto: RevertPostRecordDto, result) {
    const post = new Post();
    post.comment = revertPostRecordDto.comment;
    post.content = result.content;
    post.movie = result.movie;
    post.version = new Date();
    try {
      return await this.save(post);
    } catch (error) {
      console.log(error);
    }
  }

  // 신고할 때 해당 post 작성자 id를 찾기 위해 post 테이블에서 postId를 기준으로 userId를 찾는다.
  // async findReportedId(postId: number) {
  //   const notificationPost = await this.findOne({
  //     where: { postId }
  //   });

  //   return notificationPost.user;
  // };
}
