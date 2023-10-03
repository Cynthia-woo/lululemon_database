import {BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export class BaseClass extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    isActive: boolean

    @Column()
    isDelete: boolean

}