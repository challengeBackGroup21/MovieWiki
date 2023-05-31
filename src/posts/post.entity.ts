import { IsDate, IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Like } from '../likes/like.entity';
import { Movie } from '../movies/movie.entity';
import { Notification } from '../notifications/notification.entity';

@Entity()
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

  @Column({ nullable: true })
  @IsDate()
  version: Date;

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

  @ManyToOne(() => Movie, (movie) => movie.posts, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
