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
  nationAlt: string;

  @Column()
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

  @OneToMany(() => Post, (post) => post.movie, { eager: true })
  posts: Post[];

  @OneToMany(() => Notification, (notification) => notification.movie, {
    eager: true,
  })
  notifications: Notification[];

  @OneToMany(() => Like, (like) => like.movie, { eager: true })
  thisMovieLikes: Like[];
}
