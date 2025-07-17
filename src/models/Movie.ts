import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Review } from './Review';
import { UserListItem } from './UserListItem';
import { Forum } from './Forum';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id!: number; // Usar number, não Number

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at!: Date;

    // Relações do SEU projeto
    @OneToMany(() => Review, review => review.movie)
    reviews!: Review[];

    @OneToMany(() => UserListItem, userListItem => userListItem.movie)
    listItems!: UserListItem[];

    // Relação do OUTRO projeto
    @OneToMany(() => Forum, forum => forum.related_movie)
    forums!: Forum[];

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}