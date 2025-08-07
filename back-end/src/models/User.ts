import { 
    Entity, PrimaryGeneratedColumn, Column, 
    CreateDateColumn, UpdateDateColumn, 
    OneToMany, ManyToMany, JoinTable 
} from "typeorm";


import { Review } from "./Review";
import { UserListItem } from "./UserListItem";
import { Notification } from "./Notification";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, length: 50 })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false }) 
    password!: string;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @OneToMany(() => Review, review => review.user)
    reviews!: Review[];

    @OneToMany(() => UserListItem, item => item.user)
    listItems!: UserListItem[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications!: Notification[];


    @ManyToMany(() => User, user => user.followers)
    @JoinTable({
        name: "user_followers", 
        joinColumn: { name: "userId", referencedColumnName: "id" }, 
        inverseJoinColumn: { name: "followerId", referencedColumnName: "id" } 
    })
    following!: User[];

    @ManyToMany(() => User, user => user.following)
    followers!: User[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}