import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class Comment {

    @PrimaryGeneratedColumn()
    id!: Number;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    forumId: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    modified_at!: Date;

    @Column({type: 'boolean', default: false})
    isEdited!: boolean;

    @Column({ nullable: true })
    replyToCommentId?: number;

    constructor(content: string, username: string, forumId: number, isEdited: boolean, replyToCommentId?: number) {
        this.content = content;
        this.username = username;
        this.forumId = forumId;
        this.isEdited = isEdited;
        this.replyToCommentId = replyToCommentId;
    }
}