// Caminho: back-end/src/models/Notification.ts

import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn 
} from 'typeorm';
import { User } from './User';

// Usar um Enum para tipos de notificação é uma ótima prática para consistência.
export enum NotificationType {
  NEW_FOLLOWER = 'new_follower',
  NEW_COMMENT_ON_FORUM = 'new_comment_on_forum',
  NEW_LIKE_ON_COMMENT = 'new_like_on_comment',
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false, onDelete: 'CASCADE' })
  user!: User; // O usuário que RECEBE a notificação.

  @Column()
  userId!: number;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column({ type: 'text' })
  message!: string;

  // Um ID relacionado ao recurso que gerou a notificação
  // (ex: ID do usuário que começou a seguir, ID do fórum que foi comentado).
  @Column({ nullable: true })
  relatedEntityId?: number;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}