import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {IsEmail, IsInt, Max, Min, MinLength} from "class-validator";
import {BaseClass} from "./BaseClass";
import {Product} from "./Product";
import {Order} from "./Order";

@Entity('user')
export class User extends BaseClass{

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @Min(0)
    @Max(99)
    @IsInt()
    age: number;

    @Column()
    @MinLength(1)
    password: string;

    @Column()
    @IsEmail()
    email: string;

    @OneToMany(() => Product, product => product.user)
    products: Product[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[]

}
