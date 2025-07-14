import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm"
import { Movie } from "./Movie"

@Entity()
export class Forum {

    @PrimaryGeneratedColumn()
    id!: Number

    @Column({nullable: false, update: false})
    generated_by_user: string

    @Column()
    title: string

    @Column({ nullable: true})
    description!: string

    @CreateDateColumn()
    created_at!: Date


    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Movie, (movie) => movie.id, {nullable: false})
    related_movie: Movie

    constructor(title: string, description: string, username: string, relatedMovie: Movie) {
        this.title = title
        this.description = description
        this.generated_by_user = username,
        this.related_movie = relatedMovie
    }
  

}