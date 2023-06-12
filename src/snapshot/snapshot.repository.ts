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
  async findSnapshotByVersion(
    movieId: number,
    version: number,
  ): Promise<string> {
    version = Math.floor(version / 10) * 10 + 1;

    if (version !== undefined) {
      const snapshot = await this.createQueryBuilder('snapshot')
        .leftJoinAndSelect('snapshot.movie', 'movie')
        .where('movie.movieId = :movieId', { movieId })
        .andWhere('snapshot.version = :version', { version })
        .getOne();

      return snapshot?.content;
    }
  }
}
