import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User.js';
import { Movie } from './Movie.js';

export enum ListType {
  WATCHED = 'WATCHED',
  WANT_TO_WATCH = 'WANT_TO_WATCH',
}

@Entity()
export class UserListItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: ListType,
  })
  listType!: ListType;

  @ManyToOne(() => User, (user) => user.listItems)
  user!: User;

  @ManyToOne(() => Movie, (movie) => movie.listItems, { eager: true })
  movie!: Movie;
  
  @CreateDateColumn()
  addedAt!: Date;
}
