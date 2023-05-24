import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    OneToMany,
    ManyToOne,
    joinColumn,
    CreateDateColumn,
    UpdateDateColumn,

} from "typeorm";
import { Post } from "../posts/post.entity";
import { Movie } from "../movies/movie.entity";
import { User } from "../auth/user.entity";

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    likeId: number;

    @ManyToOne(() => User, (user) => user.likes, { eager: false})
    @joinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;

    @ManyToOne(() => Post, (post) => post.likes, { eager: false})
    @joinColumn({ name: 'postId', referencedColumnName: 'postId' })
    post: Post;

    @ManyToOne(() => Movie, (movie) => movie.thisMovieLikes, { eager: false})
    @joinColumn({ name: 'movieId', referencedColumnName: 'movieId' })
    movie: Movie;
}