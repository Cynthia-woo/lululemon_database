import {BaseClass} from "./BaseClass";
import {Column, Entity, ManyToOne} from "typeorm";
import {IsDecimal, IsIn, IsInt, Min} from "class-validator";
import {User} from "./User";

@Entity('product')
export class Product extends BaseClass{
    @Column({type:'decimal',precision:10, scale:2})
    @IsDecimal()
    price: string;

    @Column()
    des: string;

    @Column()
    name: string;

    @Column()
    color: string

    @Column()
    colorName: string

    @Column()
    imageUrl: string

    @Column()
    @IsInt()
    size: string

    @ManyToOne(() => User, user=> user.products)
    user: User;
}