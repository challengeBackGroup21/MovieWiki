import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,

} from "typeorm";
import { Post } from "../posts/post.entity";
import { Notification } from "../notifications/notification.entity";
import { Like } from "../likes/like.entity";

@Entity()
@Unique(['email', 'nickname'])
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn()
    movieId: number;

    @Column()
    movieCd: string;

    @Column()
    movieNm: string;

    @Column()
    showTm: string;

    @Column()
    openDt: string;

    @Column()
    typeNm: string;

    @Column()
    nationNm: string;

    @Column()
    genres: string;

    @Column()
    directors: string;

    @Column()
    actors: string;

    @Column()
    watchGradeNm: string;

    @Column()
    likes: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => Post, post => post.movie, { eager: true })
    posts: Post[];

    @OneToMany(() => Notification, notification => notification.movie, { eager: true })
    notifications: Notification[];

    @OneToMany(() => Like, like => like.movie, { eager: true })
    thisMovieLikes: Like[];

}