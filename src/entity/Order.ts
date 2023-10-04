import {Column, Entity, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {BaseClass} from "./BaseClass";
import {Min} from "class-validator";
import {User} from "./User";
import {Product} from "./Product";

@Entity('order')
export class Order extends BaseClass{
    @Column({type:'decimal', precision:10, scale:2, default : 1.03})
    @Min(0.5)
    taxRate: string;

    // @Column()
    // // @Min(0.5)
    // taxRate: 1.03;

    @Column({type:'decimal', precision:10, scale:2, default : 0.00})
    totalPrice: string;


    @ManyToOne(() => User, user => user.orders)
    user: User

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]
}