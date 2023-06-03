import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from 'src/movies/movie.repository';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { PostRepository } from './post.repository';

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
      return { message: '영화 수정 기록 생성에 성공했습니다.' };
    } catch (error) {
      throw new HttpException('수정 기록 생성에 실패했습니다', 400);
    }
  }

  async getOnePostRecord(movieId: number, postId: number) {
    try {
      const isExistMovie = await this.movieRepository.findOneMoive(movieId);
      if (!isExistMovie) {
        throw new HttpException('영화가 존재하지 않습니다.', 403);
      }

      const allData = await this.postRepository.getOnePostRecord(
        movieId,
        postId,
      );
      const result = {
        userId: allData.userId?.userId || '',
        content: allData.content,
        commnet: allData.comment,
        createdAt: allData.createdAt,
        version: allData.version,
      };
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('수정 기록 조회에 실패했습니다.', 400);
    }
  }

  async getPostRecords(movieId: number) {
    try {
      const isExistMovie = await this.movieRepository.findOneMoive(movieId);

      if (!isExistMovie) {
        throw new HttpException('영화가 존재하지 않습니다.', 403);
      }

      const allData = await this.postRepository.getPostRecords(movieId);

      const result = allData.map((data) => {
        return {
          postId: data.postId,
          userId: data.userId?.userId || '',
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
  ) {
    const result = await this.getOnePostRecord(movieId, postId);
    try {
      await this.postRepository.revertPostRecord(revertPostRecordDto, result);
      return { message: '기록 생성에 성공하였습니다' };
    } catch (error) {
      throw new HttpException('기록 생성에 실패하였습니다', 400);
    }
  }
}
