import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Like } from '../likes/like.entity';
import { Notification } from '../notifications/notification.entity';
import { Post } from '../posts/post.entity';

@Entity()
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  userId: number;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  nickname: string;

  @Column()
  @IsDate()
  limitedAt: Date;

  @Column()
  @IsNumber()
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
