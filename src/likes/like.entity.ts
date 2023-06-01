import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Movie } from '../movies/movie.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.likes, { eager: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  userId: number;

  @ManyToOne(() => Post, (post) => post.likes, { eager: false })
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  postId: number;

  @ManyToOne(() => Movie, (movie) => movie.thisMovieLikes, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movieId: number;
}
