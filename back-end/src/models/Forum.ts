import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    ManyToOne, 
    UpdateDateColumn 
} from "typeorm";

import { Movie } from "./Movie";
import { User } from "./User"; 

@Entity("forums") 
export class Forum {

    @PrimaryGeneratedColumn()
    id!: number; 

    @ManyToOne(() => User, user => user.id, { eager: true, nullable: false })
    creator!: User;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => Movie, (movie) => movie.id, { eager: true, nullable: false })
    related_movie: Movie;
    

    constructor(title: string, description: string, creator: User, relatedMovie: Movie) {
        this.title = title;
        this.description = description;
        this.creator = creator; 
        this.related_movie = relatedMovie;
    }
}