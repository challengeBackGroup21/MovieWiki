import { IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Post } from 'src/posts/post.entity';

@Entity()
export class Snapshot extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  snapshotId: number;

  @Column()
  @IsNumber()
  version: number;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsBoolean()
  isLatest: boolean;

  @ManyToOne(() => Post, (post) => post.likes, { eager: false })
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  postId: number;

  @ManyToOne(() => Movie, (movie) => movie.thisMovieLikes, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movieId: number;
}
