import { IsBoolean, IsNumber, IsString } from 'class-validator';
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

  @Column({ name: 'postId'})
  postId: number;

  @Column({ name: 'movieId'})
  movieId: number;

  @Column()
  @IsNumber()
  version: number;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsBoolean()
  isLatest: boolean;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId'})
  post: Post;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId'})
  movie: Movie;
}
