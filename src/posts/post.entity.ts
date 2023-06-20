import { IsNumber, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Like } from '../likes/like.entity';
import { Movie } from '../movies/movie.entity';
import { Notification } from '../notifications/notification.entity';
import { Snapshot } from 'src/snapshot/snapshot.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  postId: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'movieId' })
  movieId: number;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsString()
  comment: string;

  @VersionColumn({ nullable: true })
  @IsNumber()
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Notification, (Notification) => Notification.postId, {
    eager: true,
  })
  notifications: Notification[];

  @OneToMany(() => Like, (like) => like.postId, { eager: true })
  likes: Like[];

  @OneToMany(() => Snapshot, (snapshot) => snapshot.postId, { eager: false })
  snapshot: Snapshot[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}
