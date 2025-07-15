import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from './Review.js';
import { UserListItem } from './UserListItem.js';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;
  
  @Column()
  releaseYear!: number;

  @OneToMany(() => Review, (review) => review.movie)
  reviews!: Review[];

  @OneToMany(() => UserListItem, (listItem) => listItem.movie)
  listItems!: UserListItem[];
}
