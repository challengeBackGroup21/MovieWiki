import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { MovieRepository } from 'src/movies/movie.repository';
import { DataSource } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { RevertPostRecordDto } from './dto/revert-post-record.dto';
import { PostRepository } from './post.repository';
import { ProcessedPost } from './types/process-post.type';
import { SnapshotRepository } from 'src/snapshot/snapshot.repository';
import { Snapshot } from 'src/snapshot/snapshot.entity';
import { DiffUtil } from './diff.util';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository,
    @InjectRepository(SnapshotRepository)
    private readonly snapshotRepository: SnapshotRepository,
    private dataSource: DataSource,
  ) {}

  async createPostRecord(
    createPostRecordDto: CreatePostRecordDto,
    movieId: number,
    user: User,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    console.log('Transaction started');
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const isExistMovie = await this.movieRepository.findOneMovie(movieId);
      if (!isExistMovie) {
        throw new HttpException('영화가 존재하지 않습니다', 400);
      }

      const latestPost = await this.postRepository.getLatestPostRecord(movieId);

      if (
        !(
          createPostRecordDto.version === '' ||
          latestPost.version.toString() === createPostRecordDto.version
        )
      ) {
        throw new HttpException('최신 기록이 변경되었습니다', 409);
      }

      const diffUtil = new DiffUtil();
      let content = '';
      if (!latestPost) {
        // 최초 생성인 경우
        content = JSON.stringify(
          diffUtil.diffLineToWord('', createPostRecordDto.content),
        );
      } else {
        // 최초 생성이 아닌 경우
        const latestSnapshot = await this.snapshotRepository.findOne({
          where: { isLatest: true, movieId },
        });
        content = JSON.stringify(
          diffUtil.diffLineToWord(
            latestSnapshot.content,
            createPostRecordDto.content,
          ),
        );
      }

      await this.postRepository.createPostRecord(
        createPostRecordDto,
        isExistMovie,
        user,
        queryRunner.manager,
        content,
      );

      await queryRunner.commitTransaction();
      console.log('Transaction committed');

      // 여기서부터 snapshot 생성 코드
      const newPost = await this.postRepository.getLatestPostRecord(movieId);
      console.log(newPost);

      if (newPost.version === 1) {
        // 최초 버전인 경우 생성
        // createSnapshot()
        const newSnapshot = new Snapshot();
        newSnapshot.content = createPostRecordDto.content;
        newSnapshot.movieId = movieId;
        newSnapshot.postId = newPost.postId;
        newSnapshot.version = newPost.version;
        newSnapshot.isLatest = true;
        await this.snapshotRepository.save(newSnapshot);
      } else {
        // 갱신
        const snapshotToUpdate = await this.snapshotRepository.findOne({
          where: { isLatest: true, movieId },
        });
        snapshotToUpdate.content = createPostRecordDto.content;
        snapshotToUpdate.version++;
        snapshotToUpdate.postId = newPost.postId;
        await this.snapshotRepository.save(snapshotToUpdate);
      }

      // 10 배수 snapshot
      if ((newPost.version - 1) % 10 === 0) {
        const newSnapshot = new Snapshot();
        newSnapshot.content = createPostRecordDto.content;
        newSnapshot.movieId = movieId;
        newSnapshot.postId = newPost.postId;
        newSnapshot.version = newPost.version;
        newSnapshot.isLatest = false;
        await this.snapshotRepository.save(newSnapshot);
      }

      return { message: '영화 기록 생성에 성공했습니다.' };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      console.log('Transaction rolled back');
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('기록 생성에 실패했습니다', 400);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getLatestPostRecord(movieId: number): Promise<ProcessedPost> {
    const isExistMovie = await this.movieRepository.findOneMovie(movieId);
    if (!isExistMovie) {
      throw new HttpException('영화가 존재하지 않습니다', 403);
    }
    const latestPost = await this.postRepository.getLatestPostRecord(movieId);
    // console.log(latestPost);
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
    user: User,
  ) {
    const previousVersionPost = await this.postRepository.getOnePostRecord(
      movieId,
      postId,
    );
    if (!previousVersionPost) {
      throw new HttpException('이전 버전이 존재하지 않습니다', 400);
    }
    try {
      await this.postRepository.revertPostRecord(
        revertPostRecordDto,
        previousVersionPost,
        user,
      );
      return { message: '기록 생성에 성공하였습니다' };
    } catch (error) {
      throw new HttpException('기록 생성에 실패하였습니다', 400);
    }
  }
}
