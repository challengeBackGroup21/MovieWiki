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

  @Column({ nullable: true, default: null })
  @IsDate()
  limitedAt: Date;

  @Column({ default: 0 })
  @IsNumber()
  banCount: number;

  @Column({ length: 4, default: 'USER' })
  @IsString()
  auth: string;

  @Column({ nullable: true, default: null })
  refreshToken: string;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.user, { eager: false })
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.reporterId, {
    eager: false,
  })
  notifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.reportedId, {
    eager: false,
  })
  reportNotifications: Notification[];

  @OneToMany(() => Like, (like) => like.userId, { eager: false })
  likes: Like[];
}
