import { AppDataSource } from "../infra/setup_db";
import { Forum } from "../models/Forum";

export default class ForumRepository {
  private static instance: ForumRepository;
  private forumRepo = AppDataSource.getRepository(Forum);

  private constructor() {}

  static getInstance(): ForumRepository {
    if (!ForumRepository.instance) {
      ForumRepository.instance = new ForumRepository();
    }
    return ForumRepository.instance;
  }

  getAll(): Promise<Forum[]> {
    return this.forumRepo.find();
  }

  getById(id: Number): Promise<Forum | null> {
    return this.forumRepo.findOne({
      where: { id }
    });
  }

  searchByTitle(title: string): Promise<Forum[]> {
    return this.forumRepo
      .createQueryBuilder("forum")
      .where("forum.title LIKE :title", { title: `%${title}%` })
      .getMany();
  }

  searchByCreatorUser(username: string): Promise<Forum[]> {
    return this.forumRepo.find({
      where: { generated_by_user: username }
    });
  }

  saveForum(forum: Forum): Promise<Forum> {
    return this.forumRepo.save(forum);
  }
}
