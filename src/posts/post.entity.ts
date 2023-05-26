import { IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Like } from '../likes/like.entity';
import { Movie } from '../movies/movie.entity';
import { Notification } from '../notifications/notification.entity';

@Entity()
@Unique(['email', 'nickname'])
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  postId: number;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsString()
  comment: string;

  @Column()
  @IsNumber()
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany((type) => Notification, (Notification) => Notification.post, {
    eager: true,
  })
  notifications: Notification[];

  @OneToMany((type) => Like, (like) => like.post, { eager: true })
  likes: Like[];

  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @ManyToOne(() => User, (movie) => movie.posts, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
