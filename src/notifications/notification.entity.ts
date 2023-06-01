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
import { NotificationStatus } from './notification-status.enum'

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  notiId: number;

  @Column()
  @IsString()
  notificationContent: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.AWAIT
  })
  @IsString()
  status: NotificationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { eager: true })
  @JoinColumn({ name: 'reporterId', referencedColumnName: 'userId' })
  reporterId: number;

  @ManyToOne(() => User, (user) => user.reportNotifications, { eager: true })
  @JoinColumn({ name: 'reportedId', referencedColumnName: 'userId' })
  reportedId: number;

  @ManyToOne(() => Post, (post) => post.notifications, { eager: false })
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  postId: number;

  @ManyToOne(() => Movie, (movie) => movie.notiMovieId, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movieId: number;
}
