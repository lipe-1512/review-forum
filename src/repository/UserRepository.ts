import { AppDataSource } from '../infra/db';
import { User } from '../models/User';

export const userRepository = AppDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOneBy({ email });
  },

  findByIdWithRelations(id: number, relations: string[]) {
      return this.findOne({ where: { id }, relations });
  }
});
