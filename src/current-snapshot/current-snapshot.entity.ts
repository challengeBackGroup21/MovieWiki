import { IsNumber, IsString } from 'class-validator';
import { Movie } from 'src/movies/movie.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  VersionColumn,
} from 'typeorm';

@Entity()
export class CurrentSnapshot extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  currentSnapshotId: number;

  @RelationId((CurrentSnapshot: CurrentSnapshot) => CurrentSnapshot.movie)
  movieId: number;

  @Column()
  @IsString()
  content: string;

  @VersionColumn()
  version: number;

  @OneToOne(() => Movie, (movie) => movie.currentSnapshot, { eager: true })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
