import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

export enum NotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_COMMENT = 'NEW_COMMENT',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false })
  user!: User;

  @Column()
  userId!: number;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column()
  message!: string;

  @Column()
  relatedId!: number;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
