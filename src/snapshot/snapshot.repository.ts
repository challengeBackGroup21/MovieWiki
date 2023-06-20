import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Snapshot } from './snapshot.entity';

@Injectable()
export class SnapshotRepository extends Repository<Snapshot> {
  constructor(private dataSource: DataSource) {
    super(Snapshot, dataSource.manager);
  }

  // 특정 영화의 최신 snapshot 검색
  async getLatestPostRecord(movieId: number): Promise<Snapshot> {
    const latestPost = await this.createQueryBuilder('snapshot')
      .leftJoinAndSelect('snapshot.movie', 'movie')
      .where('movie.movieId = :movieId', { movieId })
      .orderBy('snapshot.version', 'DESC')
      .getOne();
    // console.log(latestPost);
    return latestPost;
  }

  // version 값을 이용해 전체 snapshot 데이터를 검색
  async findSnapshotByVersion(movieId: number, version: number): Promise<Snapshot> {
    const snapshotVersion = Math.floor((version - 1) / 10) * 10 + 1;

    if (snapshotVersion !== undefined) {
      const snapshot = await this.createQueryBuilder('snapshot')
        .leftJoinAndSelect('snapshot.movie', 'movie')
        .where('movie.movieId = :movieId', { movieId })
        .andWhere('snapshot.version = :version', { version: snapshotVersion })
        .getOne();

      return snapshot;
    }
  }

  // rollback 버전이 10의 배수일 경우 스냅샷 업데이트
  async rollbackVersionUpdateSnapshot(
    movieId: number,
    postId: number,
    version: number,
    content: string
  ) {
    const snapshot = new Snapshot();
    snapshot.movieId = movieId;
    snapshot.postId = postId;
    snapshot.version = version;
    snapshot.content = content;
    snapshot.isLatest = false;

    console.log(snapshot);
    await this.manager.save(snapshot);
  };
}
