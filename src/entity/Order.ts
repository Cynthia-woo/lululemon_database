import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {BaseClass} from "./BaseClass";
import {Min} from "class-validator";
import {User} from "./User";
import {Product} from "./Product";

@Entity('order')
export class Order extends BaseClass{
    @Column({type:'decimal', precision:10, scale:2})
    @Min(0.5)
    taxRate: string;

    @ManyToOne(() => User, user => user.orders)
    user: User

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]
}