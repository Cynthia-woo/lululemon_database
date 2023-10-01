import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne, ManyToMany,
    JoinTable, BaseEntity
} from "typeorm";

@Entity()
export class BaseClass extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
}