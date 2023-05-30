import { IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Movie } from '../movies/movie.entity';
import { Post } from '../posts/post.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  notiId: number;

  @Column()
  @IsString()
  notificationContent: string;

  @Column()
  @IsString()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { eager: true })
  @JoinColumn({ name: 'reporterId', referencedColumnName: 'userId' })
  reporter: User;

  @ManyToOne(() => User, (user) => user.reportNotifications, { eager: true })
  @JoinColumn({ name: 'reportedId', referencedColumnName: 'userId' })
  reported: User;

  @ManyToOne(() => Post, (post) => post.notifications, { eager: false })
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  post: Post;

  @ManyToOne(() => Movie, (movie) => movie.notifications, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
