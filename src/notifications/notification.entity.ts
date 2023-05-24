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
// import { Post } from "../posts/post.entity";
// import { Movie } from "./movies/movie.entity";
import { User } from "../auth/user.entity";

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    notiId: number;

    @Column()
    notificationContent: string;

    @Column()
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.likes, { eager: false })
    @joinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;

    @ManyToOne(() => User, (user) => user.likes, { eager: false })
    @joinColumn({ name: 'reportUserId', referencedColumnName: 'userId' })
    reportUser: User;

    @ManyToOne(() => Post, (post) => post.likes, { eager: false })
    @joinColumn({ name: 'postId', referencedColumnName: 'postId' })
    post: Post;

    @ManyToOne(() => Movie, (movie) => movie.likes, { eager: false })
    @joinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
    movie: Movie;
}