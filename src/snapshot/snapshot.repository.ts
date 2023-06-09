import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from 'src/movies/movie.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreatePostRecordDto } from '../posts/dto/create-post-record.dto';
import { Snapshot } from './snapshot.entity';

@Injectable()
export class SnapshotRepository extends Repository<Snapshot> {
  constructor(private dataSource: DataSource) {
    super(Snapshot, dataSource.manager);
  }
}
