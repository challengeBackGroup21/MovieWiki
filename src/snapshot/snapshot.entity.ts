import { IsNumber, IsString } from 'class-validator';
import { Post } from 'src/posts/post.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity()
export class Snapshot extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  snapshotId: number;

  @IsNumber()
  movieId: number;

  @IsNumber()
  postId: number;

  @Column()
  @IsNumber()
  version: number;

  @Column()
  @IsString()
  content: string;

  // Entity를 만들 때 고려해야 할 사항
  /**
   1. column 다 적어주기.
   */

  @ManyToOne(() => Movie, (movie) => movie.snapshots, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  post: Post;
}
