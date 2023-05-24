import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Movie } from '../movies/movie.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  notiId: number;

  @Column()
  notificationContent: string;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { eager: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @ManyToOne(() => User, (user) => user.reportNotifications, { eager: false })
  @JoinColumn({ name: 'reportUserId', referencedColumnName: 'userId' })
  reportUser: User;

  @ManyToOne(() => Post, (post) => post.notifications, { eager: false })
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  post: Post;

  @ManyToOne(() => Movie, (movie) => movie.notifications, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
