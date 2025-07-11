import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Forum } from "./Forum";

@Entity()
class Comment {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false })
    usernameAuthor: string;

    @ManyToOne(() => Forum, (forum) => forum.id)
    forumId: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    modified_at!: Date;

    @Column({type: 'boolean', default: false})
    isEdited!: boolean;

    @Column({type: 'boolean', default: false, update: false})
    isReply!: boolean;

    @OneToOne(() => Comment, (comment) => comment.id, {nullable: true})
    replyToCommentId?: number;

    constructor(id: number, content: string, usernameAuthor: string, forumId: number, isEdited: boolean, replyToCommentId?: number) {
        this.id = id;
        this.content = content;
        this.usernameAuthor = usernameAuthor;
        this.forumId = forumId;
        this.isEdited = isEdited;
        this.isReply = !!replyToCommentId;
        this.replyToCommentId = replyToCommentId;
    }
}