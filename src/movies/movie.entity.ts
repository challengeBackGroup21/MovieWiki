import { IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from '../likes/like.entity';
import { Notification } from '../notifications/notification.entity';
import { Post } from '../posts/post.entity';

@Entity()
@Unique(['email', 'nickname'])
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  movieId: number;

  @Column()
  @IsString()
  movieCd: string;

  @Column()
  @IsString()
  movieNm: string;

  @Column()
  @IsString()
  showTm: string;

  @Column()
  @IsString()
  openDt: string;

  @Column()
  @IsString()
  typeNm: string;

  @Column()
  @IsString()
  nationNm: string;

  @Column()
  @IsString()
  genres: string;

  @Column()
  @IsString()
  directors: string;

  @Column()
  @IsString()
  actors: string;

  @Column()
  @IsString()
  watchGradeNm: string;

  @IsNumber()
  @Column()
  likes: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.movie, { eager: true })
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.movie, {
    eager: true,
  })
  notifications: Notification[];

  @OneToMany(() => Like, (like) => like.movie, { eager: true })
  thisMovieLikes: Like[];
}
