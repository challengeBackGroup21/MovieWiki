import { Module } from '@nestjs/common';
import { SnapshotRepository } from './snapshot.repository';

@Module({
  exports: [SnapshotRepository],
})
export class SnapshotModule {}
