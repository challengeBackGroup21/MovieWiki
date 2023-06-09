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
  async createCurrentSnapshot(
    movieId: number,
    manager: EntityManager,
    content: string,
  ) {
    // 최초 버전이 없는 경우
    const currentSnapshot = new CurrentSnapshot();
    currentSnapshot.movieId = movieId;
    currentSnapshot.version = 1;
    currentSnapshot.content = content;

    console.log('어떻게 생겼어?', currentSnapshot);

    await manager.save(currentSnapshot);
  }

  async updateCurrentSnapshot(
    currentSnapshot: CurrentSnapshot,
    manager: EntityManager,
    content: string,
  ): Promise<void> {
    //   currentSnapshot.version = currentSnapshot.version + 1;

    console.log('여기서는 어때?', currentSnapshot);

    currentSnapshot.content = content;
    await manager.save(currentSnapshot);

    await manager
      .getRepository(CurrentSnapshot)
      .createQueryBuilder('currentSnapshot')
      .setLock('optimistic', currentSnapshot.version)
      .where('currentSnapshot.movieId  = :movieId', {
        movieId: currentSnapshot.movieId,
      })
      .execute();
  }
}
