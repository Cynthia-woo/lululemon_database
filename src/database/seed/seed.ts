import {Factory, Seeder} from 'typeorm-seeding'
import {User} from "../../entity/User";
import {Product} from "../../entity/Product";
import {Order} from "../../entity/Order";
export class generateSeeds implements Seeder{
    run = async (factory: Factory) : Promise<void> => {
        const users = await factory(User)().createMany(3)
        const products = await factory(Product)().map(async product => {
            product.user = users[Math.floor(Math.random() * users.length)]
            return product
        }).createMany(10)
        // await factory(Order)().map(async order => {
        //     order.user = await users[Math.floor(Math.random() * users.length)]
        //
        //     const product = products[Math.floor(Math.random() * products.length)]
        //     return order
        // }).createMany(2)
    }
}