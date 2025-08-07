import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
@Unique(['userId', 'commentId'])
export class CommentLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.commentLikes, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(() => Comment, (comment) => comment.likes, { nullable: false })
  @JoinColumn({ name: 'commentId' })
  comment!: Comment;

  @Column()
  commentId!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
