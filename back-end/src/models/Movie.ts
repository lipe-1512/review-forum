import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from 'typeorm'
import { Review } from './Review';

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name: string

    @Column()
    description!: string

    @CreateDateColumn()
    created_at!: Date

    @OneToMany(() => Review, review => review.movie)
    reviews!: Review[];


  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

}