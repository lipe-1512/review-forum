const { Entity, PrimaryGeneratedColumn, Column} = require('typeorm')

@Entity()
export class Movie {

    @PrimaryGeneratedColumn()
    id!: Number

    @Column()
    name: string

    @Column()
    description: string

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

}