import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from './Review';
import { UserListItem } from './UserListItem';

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
