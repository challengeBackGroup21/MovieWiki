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
  async updateCurrentSnapshot(
    movieId: number,
    manager: EntityManager,
    content: string,
  ): Promise<void> {
    let currentSnapshot = await manager
      .createQueryBuilder(CurrentSnapshot, 'currentSnapshot')
      .where('currentSnapshot.movieId=:movieId', {
        movieId: movieId,
      })
      .getOne();

    if (!currentSnapshot) {
      // 최초 버전이 없는 경우
      currentSnapshot = new CurrentSnapshot();
      currentSnapshot.movieId = movieId;
      currentSnapshot.version = 1;
      currentSnapshot.content = content;

      await manager.save(currentSnapshot);
    } else {
      await manager
        .createQueryBuilder(CurrentSnapshot, 'currentSnapshot')
        .update(CurrentSnapshot)
        .set({ content: content, version: currentSnapshot.version + 1 })
        .where('movieId  = :movieId', {
          movieId: movieId,
        })
        .execute();
    }
  }
}
