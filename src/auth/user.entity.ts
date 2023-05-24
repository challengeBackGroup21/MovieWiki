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
// import { Post } from "./Posts/Post.entity";
import { Notification } from "../notifications/notification.entity";
import { Like } from "../likes/like.entity";

@Entity()
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    nickname: string;

    @Column()
    limitedAt: string;

    @Column()
    banCount: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @OneToMany(type => Post, Post => Post.user, { eager: true })
    posts: Post[];

    @OneToMany(type => Notification, Notification => Notification.user, { eager: true })
    notifications: Notification[];

    @OneToMany(type => Like, like => like.user, { eager: true })
    likes: Like[];
}