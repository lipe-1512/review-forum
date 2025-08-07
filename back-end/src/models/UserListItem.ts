import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn 
} from "typeorm";
import { User } from "./User";
import { Movie } from "./Movie";

@Entity("user_list_items")
export class UserListItem {
    @PrimaryGeneratedColumn()
    id!: number;

    // O nome da lista (ex: 'watchlist', 'watched', 'favorites')
    @Column({ length: 50 })
    listType!: string;

    // Muitos itens pertencem a um usuário
    @ManyToOne(() => User, user => user.listItems, { nullable: false, onDelete: 'CASCADE' })
    user!: User;

    // Muitos itens se referem a um filme
    @ManyToOne(() => Movie, movie => movie.id, { nullable: false, onDelete: 'CASCADE' })
    movie!: Movie;

    @CreateDateColumn()
    added_at!: Date;
}