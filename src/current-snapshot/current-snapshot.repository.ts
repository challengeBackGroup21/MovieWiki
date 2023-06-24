import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from 'src/movies/movie.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { CurrentSnapshot } from './current-snapshot.entity';

@Injectable()
export class CurrentSnapshotRepository extends Repository<CurrentSnapshot> {
  constructor(private dataSource: DataSource) {
    super(CurrentSnapshot, dataSource.createEntityManager());
  }
  // 현재 스냅샷 없을 때 생성
  async createCurrentSnapshot(
    movieId: number,
    createPostRecordDto: CreatePostRecordDto,
    manager: EntityManager,
  ) {
    // 최초 버전이 없는 경우
    const currentSnapshot = new CurrentSnapshot();
    currentSnapshot.movieId = movieId;
    currentSnapshot.version = 1;
    currentSnapshot.comment = createPostRecordDto.comment;
    currentSnapshot.content = createPostRecordDto.content;

    console.log('어떻게 생겼어?', currentSnapshot);

    await manager.save(currentSnapshot);
  }
  // 현재 스냅샷 업데이트
  async updateCurrentSnapshot(
    currentSnapshot: CurrentSnapshot,
    createPostRecordDto: CreatePostRecordDto,
    manager: EntityManager,
  ): Promise<void> {
    currentSnapshot.comment = createPostRecordDto.comment;
    currentSnapshot.content = createPostRecordDto.content;
    await manager.save(currentSnapshot);
  }
  // 현재 스냅샷 조회
  async findOneCurrentSnapshot(movieId: number): Promise<CurrentSnapshot> {
    return await this.createQueryBuilder('currentSnapshot')
      .where('currentSnapshot.movieId = :movieId', {
        movieId,
      })
      .getOne();
  }

  async patchSnapshot(
    movieId: number,
    content: string,
    comment: string,
    version: number,
  ): Promise<void> {
    await this.createQueryBuilder('currentSnapshot')
      .update()
      .set({ content, comment, version })
      .where('movieId = :movieId', { movieId })
      .execute();
  }
}
