import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Movie } from './Movie';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    text!: string;

    @Column('int')
    rating!: number; // e.g., 1 to 5

    @ManyToOne(() => User, user => user.reviews, { eager: true })
    user!: User;

    @ManyToOne(() => Movie, movie => movie.reviews)
    movie!: Movie;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
