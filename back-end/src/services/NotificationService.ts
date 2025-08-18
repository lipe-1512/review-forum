import { getRepository } from 'typeorm';
import { Notification, NotificationType } from '../models/Notification';
import { UserRepository } from '../repository/UserRepository';
import  ForumRepository  from '../repository/ForumRepository';

export class NotificationService {
  /**
   * Retorna todas as notificações de um usuário
   */
  static async getUserNotifications(userId: number): Promise<Notification[]> {
    return getRepository(Notification).find({
      where: { recipientId: userId },
      relations: ['sender'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Retorna apenas as notificações não lidas
   */
  static async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return getRepository(Notification).find({
      where: { recipientId: userId, isRead: false },
      relations: ['sender'],
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Marca uma notificação como lida
   */
  static async markAsRead(notificationId: number): Promise<void> {
    await getRepository(Notification).update(notificationId, { isRead: true });
  }

  /**
   * Marca todas as notificações como lidas
   */
  static async markAllAsRead(userId: number): Promise<void> {
    await getRepository(Notification).update(
      { recipientId: userId },
      { isRead: true }
    );
  }

  /**
   * Deleta uma notificação
   */
  static async deleteNotification(notificationId: number): Promise<void> {
    await getRepository(Notification).delete(notificationId);
  }

  /**
   * Cria uma notificação quando um usuário é seguido
   * @param recipientId ID do usuário que recebe a notificação (o seguido)
   * @param senderId ID do usuário que enviou a ação (o seguidor)
   */
  static async createFollowNotification(recipientId: number, senderId: number): Promise<void> {
    const notificationData = {
      recipientId,
      senderId,
      type: 'follow' as NotificationType, // ou use NotificationType.FOLLOW se for enum
      message: 'começou a seguir você',
      relatedId: senderId, // útil para redirecionar ao perfil do seguidor
      isRead: false,
    };

    try {
      await getRepository(Notification).save(notificationData);
    } catch (error) {
      console.error(`Falha ao salvar notificação de seguir para o usuário ${recipientId}:`, error);
      // Não lança erro para não quebrar a operação principal
    }
  }

  /**
   * Cria uma notificação quando um comentário é feito em um fórum do usuário
   * @param forumId ID do fórum comentado
   * @param commenterUserId ID do usuário que comentou
   */
  static async createCommentNotification(forumId: number, commenterUserId: number): Promise<void> {
    const forum = await ForumRepository.getById(forumId);
    if (!forum || !forum.creator) {
      return;
    }

    const notificationData = {
      recipientId: forum.creator.id,
      senderId: commenterUserId,
      type: 'comment' as NotificationType,
      message: 'comentou no seu post',
      relatedId: forumId,
      isRead: false,
    };

    try {
      await getRepository(Notification).save(notificationData);
    } catch (error) {
      console.error(`Falha ao salvar notificação de comentário para o usuário ${forum.creator.id}:`, error);
    }
  }
}