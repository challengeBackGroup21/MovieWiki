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
  RelationId,
  UpdateDateColumn,
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

  @RelationId((post: Post) => post.user)
  userId: number;

  @RelationId((post: Post) => post.movie)
  movieId: number;

  @Column()
  @IsString()
  content: string;

  @Column()
  @IsString()
  comment: string;

  @Column({ nullable: true, default: null })
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
  snapshot: Snapshot;

  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.posts, { eager: false })
  @JoinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
  movie: Movie;
}
