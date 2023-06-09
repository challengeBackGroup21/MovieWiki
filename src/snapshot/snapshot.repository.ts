import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Snapshot } from './snapshot.entity';

@Injectable()
export class SnapshotRepository extends Repository<Snapshot> {
  constructor(private dataSource: DataSource) {
    super(Snapshot, dataSource.manager);
  }
}
