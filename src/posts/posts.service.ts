import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from 'src/movies/movie.repository';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
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
    // req.user.userId, 유저 정보
  ) {
    try {
      const joinnedMovie = await this.movieRepository.findOneMoive(movieId);
      await this.postRepository.createPostRecord(
        createPostRecordDto,
        joinnedMovie,
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

      const result = this.postRepository.getOnePostRecord(movieId, postId);
      return result;
    } catch (error) {
      throw new HttpException('수정 기록 조회에 실패했습니다.', 400);
    }
  }

  async getPostRecords(movieId: number) {
    try {
      const isExistMovie = await this.movieRepository.findOneMoive(movieId);

      if (!isExistMovie) {
        throw new HttpException('영화가 존재하지 않습니다.', 403);
      }

      const result = this.postRepository.getPostRecords(movieId);
      return result;
    } catch (error) {
      throw new HttpException('수정 기록 조회에 실패했습니다.', 400);
    }
  }
}
