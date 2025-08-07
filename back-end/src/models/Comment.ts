import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User"; 
import { Forum } from "./Forum"; 

@Entity("comments")
export default class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, type: 'text' })
    content: string;


    @ManyToOne(() => User, user => user.id, { eager: true, nullable: false }) // 'eager: true' carrega o usuário automaticamente
    author!: User;


    @ManyToOne(() => Forum, forum => forum.id, { nullable: false })
    forum!: Forum;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    modified_at!: Date;

    @Column({ type: 'boolean', default: false })
    isEdited!: boolean;

    @Column({ nullable: true })
    replyToCommentId?: number;

    constructor(content: string, author: User, forum: Forum, isEdited: boolean = false, replyToCommentId?: number) {
        this.content = content;
        this.author = author;
        this.forum = forum;
        this.isEdited = isEdited;
        this.replyToCommentId = replyToCommentId;
    }
}