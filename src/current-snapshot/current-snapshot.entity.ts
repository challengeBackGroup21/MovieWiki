import { IsNumber, IsString } from 'class-validator';
import { Movie } from '../movies/movie.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class CurrentSnapshot extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  currentSnapshotId: number;

  @Column()
  movieId: number;

  @Column({ nullable: true })
  @IsString()
  comment: string;

  @Column()
  @IsString()
  content: string;

  @VersionColumn()
  version: number;

  @OneToOne(() => Movie, (movie) => movie.currentSnapshot, { eager: true })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
