import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Users")
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;
}