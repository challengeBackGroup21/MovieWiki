import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Notification } from '../notifications/notification.entity';
import { Like } from '../likes/like.entity';

@Entity()
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ type: 'datetime' })
  limitedAt: Date;

  @Column()
  banCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.user, { eager: true })
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    eager: true,
  })
  notifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.reportUser, {
    eager: true,
  })
  reportNotifications: Notification[];

  @OneToMany(() => Like, (like) => like.user, { eager: true })
  likes: Like[];
}
