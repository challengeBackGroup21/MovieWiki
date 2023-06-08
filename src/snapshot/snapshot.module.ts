import { Module } from '@nestjs/common';
import { SnapshotRepository } from './snapshot.repository';
import { Snapshot } from './snapshot.entity';

@Module({
  providers: [SnapshotRepository, Snapshot],
  exports: [SnapshotRepository, Snapshot],
})
export class SnapshotModule {}
