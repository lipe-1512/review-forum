import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Review } from './Review';
import { UserListItem } from './UserListItem';

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id!: Number;

    @Column()
    name: string;

    @Column()
    description!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => Review, review => review.movie)
    reviews!: Review[];

    @OneToMany(() => UserListItem, userListItem => userListItem.movie)
    listItems!: UserListItem[];

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

}
