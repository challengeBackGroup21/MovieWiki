import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from 'src/movies/movie.repository';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { PostRepository } from './post.repository';
import { UpdatePostRecordDto } from './dto/update-post-record.dto';
import { ProcessedPost } from './types/process-post.type';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository,
  ) {}
  async createPostRecord(
    createPostRecordDto: CreatePostRecordDto,
    movieId: number,
    userId: any,
    // req.user.userId, 유저 정보
  ) {
    try {
      await this.postRepository.createPostRecord(
        createPostRecordDto,
        movieId,
        userId,
      ); // req.user.userId 추가 예정
      return { message: '영화 기록 생성에 성공했습니다.' };
    } catch (error) {
      throw new HttpException('기록 생성에 실패했습니다', 400);
    }
  }

  async updatePostRecord(
    updatePostRecordDto: UpdatePostRecordDto,
    movieId: number,
    userId: any,
  ) {
    try {
      await this.postRepository.updatePostRecord(
        updatePostRecordDto,
        movieId,
        userId,
      );
      return { message: '영화 수정 기록 생성에 성공했습니다.' };
    } catch (error) {
      throw new HttpException('기록 생성에 실패했습니다', 400);
    }
  }

  async getLatestPostRecord(movieId: number): Promise<ProcessedPost> {
    const isExistMovie = await this.movieRepository.findOneMovie(movieId);
    if (!isExistMovie) {
      throw new HttpException('영화가 존재하지 않습니다', 403);
    }
    const latestPost = await this.postRepository.getLatestPostRecord(movieId);
    console.log(latestPost);
    if (!latestPost) {
      throw new HttpException(
        '해당 영화에 대한 게시물이 존재하지 않습니다',
        404,
      );
    }
    const result = {
      postId: latestPost.postId,
      userId: latestPost.userId,
      content: latestPost.content,
      comment: latestPost.comment,
      createdAt: latestPost.createdAt,
      version: latestPost.version,
    };

    return result;
  }

  async getOnePostRecord(
    movieId: number,
    postId: number,
  ): Promise<ProcessedPost> {
    try {
      const isExistMovie = await this.movieRepository.findOneMovie(movieId);
      if (!isExistMovie) {
        throw new HttpException('영화가 존재하지 않습니다.', 403);
      }

      const allData = await this.postRepository.getOnePostRecord(
        movieId,
        postId,
      );
      const result = {
        postId: allData.postId,
        userId: allData.userId,
        content: allData.content,
        comment: allData.comment,
        createdAt: allData.createdAt,
        version: allData.version,
      };
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('수정 기록 조회에 실패했습니다.', 400);
    }
  }

  async getPostRecords(movieId: number): Promise<ProcessedPost[]> {
    try {
      const isExistMovie = await this.movieRepository.findOneMovie(movieId);

      if (!isExistMovie) {
        throw new HttpException('영화가 존재하지 않습니다.', 403);
      }

      const allData = await this.postRepository.getPostRecords(movieId);

      const result = allData.map((data) => {
        return {
          postId: data.postId,
          userId: data.userId,
          content: data.content,
          comment: data.comment,
          createdAt: data.createdAt,
          version: data.version,
        };
      });

      return result;
    } catch (error) {
      throw new HttpException('수정 기록 조회에 실패했습니다.', 400);
    }
  }
  // 게시글 이전 버전으로 다시 생성
  async revertPostRecord(
    revertPostRecordDto: RevertPostRecordDto,
    movieId: number,
    postId: number,
    userId: any,
  ) {
    const result = await this.getOnePostRecord(movieId, postId);
    try {
      await this.postRepository.revertPostRecord(
        revertPostRecordDto,
        result,
        movieId,
        userId,
      );
      return { message: '기록 생성에 성공하였습니다' };
    } catch (error) {
      throw new HttpException('기록 생성에 실패하였습니다', 400);
    }
  }
}
