import { UpdateResult } from "typeorm";
import { AppDataSource } from "../infra/setup_db";
import { Forum } from "../models/Forum";

export default class ForumRepository {
  
  static forumRepo = AppDataSource.getRepository(Forum);

  static getAll(): Promise<Forum[]> {
    return this.forumRepo.find(
      {
        relations: ["related_movie"],
        order: {
          updated_at: 'DESC'
        }
      }
    );
  }

  static getById(id: number): Promise<Forum | null> {
    return this.forumRepo.findOne({
      where: { id },
      relations: ["related_movie"]
    });
  }

  static searchByTitle(title: string): Promise<Forum[]> {
    return this.forumRepo
      .createQueryBuilder("forum")
      .where("forum.title LIKE :title", { title: `%${title}%` })
      .getMany();
  }

  static searchByCreatorUser(username: string): Promise<Forum[]> {
    return this.forumRepo.find({
        where: {
            creator: {
                username: username
            }
        },
        relations: ["related_movie"]
    });
  }

  static saveForum(forum: Forum): Promise<Forum> {
    return this.forumRepo.save(forum);
  }
}