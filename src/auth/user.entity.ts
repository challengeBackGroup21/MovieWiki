import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
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

  @Column({ default: false })
  @IsBoolean()
  isBanned: boolean;

  @Column({ length: 5, default: 'USER' })
  @IsString()
  auth: string;

  @Column({ nullable: true, default: null })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 왜 연결을 entity끼리 하는 거지?
  @OneToMany(() => Post, (post) => post.user, { eager: false })
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.reporterId)
  reporterNotification: Notification[];

  @OneToMany(() => Notification, (notification) => notification.reportedId)
  reportedNotification: Notification[];

  @OneToMany(() => Like, (like) => like.userId, { eager: false })
  likes: Like[];
}
