import { NotificationRepository } from "../repository/NotificationRepository";
import ForumRepository from "../repository/ForumRepository";
import { UserRepository } from "../repository/UserRepository";
import { Notification, NotificationType } from "../models/Notification";

export class NotificationService {
  static async getUserNotifications(userId: number): Promise<Notification[]> {
    return NotificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  static async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return NotificationRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' }
    });
  }

  static async markAsRead(notificationId: number): Promise<void> {
    await NotificationRepository.update(notificationId, { isRead: true });
  }

  static async markAllAsRead(userId: number): Promise<void> {
    await NotificationRepository.update({ userId }, { isRead: true });
  }

  static async deleteNotification(notificationId: number): Promise<void> {
    await NotificationRepository.delete(notificationId);
  }

  static async createFollowNotification(followedUserId: number, followerUserId: number): Promise<Notification> {
    const notification = NotificationRepository.create({
      userId: followedUserId,
      type: NotificationType.NEW_FOLLOWER,
      message: `Você tem um novo seguidor (ID: ${followerUserId})`,
      isRead: false,
    });
    return NotificationRepository.save(notification);
  }

  static async createCommentNotification(forumId: number, commenterUserId: number): Promise<Notification | null> {
    const forum = await ForumRepository.getById(forumId);
    if (!forum) {
      return null;
    }
    const notification = NotificationRepository.create({
      userId: forum.creator.id,
      type: NotificationType.NEW_COMMENT_ON_FORUM,
      message: `Novo comentário no seu fórum (ID: ${forumId}) pelo usuário (ID: ${commenterUserId})`,
      isRead: false,
    });
    return NotificationRepository.save(notification);
  }
}
