import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Movie } from "./Movie";

@Entity("reviews") // Nome da tabela no banco de dados
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', comment: "Avaliação de 1 a 5" })
    rating!: number;

    @Column({ type: 'text' })
    comment!: string;

    // Muitos reviews pertencem a um usuário. Se o usuário for deletado, suas reviews também serão.
    @ManyToOne(() => User, user => user.reviews, { nullable: false, onDelete: 'CASCADE' })
    user!: User;

    // Muitos reviews pertencem a um filme. Se o filme for deletado, suas reviews também serão.
    @ManyToOne(() => Movie, movie => movie.reviews, { nullable: false, onDelete: 'CASCADE' }) // Assumindo que você adicionará 'reviews' em Movie.ts
    movie!: Movie;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}