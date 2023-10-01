import {factory, Factory, Seeder} from "typeorm-seeding";
import {User} from '../entity/User'
import {Product} from "../entity/Product";

class generatedSeeds implements Seeder{

    run = async (Factory): Promise<void> =>{
        const users = await factory(User)().createMany(2)

        const products = await factory(Product)().createMany(10)
    }

}