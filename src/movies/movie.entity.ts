import { IsNumber, IsString } from 'class-validator';
import { CurrentSnapshot } from 'src/current-snapshot/current-snapshot.entity';
import { Snapshot } from 'src/snapshot/snapshot.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
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

  @Column({ nullable: true })
  @IsString()
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => CurrentSnapshot, (currentSnapshot) => currentSnapshot.movie, {
    eager: false,
  })
  currentSnapshot: CurrentSnapshot;

  @OneToMany(() => Post, (post) => post.movie, { eager: true })
  posts: Post[];

  @OneToMany(() => Snapshot, (snapshot) => snapshot.movieId, { eager: false })
  snapshots: Snapshot[];

  @OneToMany(() => Notification, (notification) => notification.movieId, {
    eager: true,
  })
  notiMovieId: number;

  @OneToMany(() => Like, (like) => like.movieId, { eager: true })
  thisMovieLikes: Like;
}
