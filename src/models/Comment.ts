import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Forum } from "./Forum";

@Entity()
export default class Comment {

    @PrimaryGeneratedColumn()
    id!: Number;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false })
    usernameAuthor: string;

    @ManyToOne(() => Forum, (forum) => forum.id, {nullable: false})
    forum: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    modified_at!: Date;

    @Column({type: 'boolean', default: false})
    isEdited!: boolean;

    @ManyToOne(() => Comment, (comment) => comment.id, {nullable: true})
    replyToCommentId?: number;

    constructor(content: string, usernameAuthor: string, forumId: number, isEdited: boolean, replyToCommentId?: number) {
        this.content = content;
        this.usernameAuthor = usernameAuthor;
        this.forum = forumId;
        this.isEdited = isEdited;
        this.replyToCommentId = replyToCommentId;
    }
}