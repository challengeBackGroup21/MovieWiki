import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    joinColumn
} from "typeorm";
import { Notification } from "../notifications/notification.entity";
import { Like } from "../likes/like.entity";
import { User } from "../auth/user.entity";
import { Movie } from "../movies/movie.entity";

@Entity()
@Unique(['email', 'nickname'])
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    content: string;

    @Column()
    comment: string;

    @Column()
    version: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(type => Notification, Notification => Notification.post, { eager: true })
    notifications: Notification[];

    @OneToMany(type => Like, like => like.post, { eager: true })
    likes: Like[];

    @ManyToOne(() => User, (user) => user.posts, { eager: false})
    @joinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;

    @ManyToOne(() => User, (movie) => movie.posts, { eager: false})
    @joinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
    movie: Movie;
}