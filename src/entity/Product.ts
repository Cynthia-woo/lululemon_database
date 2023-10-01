import {
    Entity,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import {Length, Min} from "class-validator";
import {BaseClass} from "./BaseClass";

@Entity()
@Unique(['slug'])
export class Product extends BaseClass{

    @Column()
    @Length(1,100)
    slug: string;

    @Column()
    @Length(1,100)
    name: string;

    @Column('decimal',{precision:5, scale:2})
    @Min(0)
    price: number;

    @Column()
    description: string;

    @Column()
    media: string

    @Column({nullable:true, default:false})
    isActive: boolean

    @Column({nullable:true, default:false})
    isDelete: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updateAt: Date

}
