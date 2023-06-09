import { Module } from '@nestjs/common';
import { CurrentSnapshot } from './current-snapshot.entity';
import { CurrentSnapshotRepository } from './current-snapshot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CurrentSnapshot])],
  providers: [CurrentSnapshotRepository, CurrentSnapshot],
  exports: [CurrentSnapshotRepository, CurrentSnapshot],
})
export class CurrentSnapshotModule {}
