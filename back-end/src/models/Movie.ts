import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm'

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id!: Number

    @Column()
    name: string

    @Column()
    description!: string

    @CreateDateColumn()
    created_at!: Date


  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

}