import { IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from '../likes/like.entity';
import { Notification } from '../notifications/notification.entity';
import { Post } from '../posts/post.entity';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  movieId: number;

  @Column({ nullable: true })
  @IsString()
  movieCd: string;

  @Column({ nullable: true })
  @IsString()
  movieNm: string;

  @Column({ nullable: true })
  @IsString()
  showTm: string;

  @Column({ nullable: true })
  @IsString()
  openDt: string;

  @Column({ nullable: true })
  @IsString()
  typeNm: string;

  @Column({ nullable: true })
  @IsString()
  nationAlt: string;

  @Column({ nullable: true })
  @IsString()
  genreAlt: string;

  @Column('jsonb')
  @IsString()
  directors: { peopleNm: string }[];

  @Column('jsonb')
  @IsString()
  actors: {
    cast: string;
    castEn: string;
    peopleNm: string;
    peopleNmEn: string;
  }[];

  @Column({ nullable: true })
  @IsString()
  watchGradeNm: string;

  @Column({ default: 0 })
  @IsNumber()
  likes: number;

  @Column({ default: 0 })
  @IsNumber()
  views: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.movie, { eager: false })
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.movieId, {
    eager: true,
  })
  notiMovieId: number;

  @OneToMany(() => Like, (like) => like.movieId, { eager: true })
  thisMovieLikes: Like;
}
