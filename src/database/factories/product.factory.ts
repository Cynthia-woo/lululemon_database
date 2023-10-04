import {faker} from '@faker-js/faker'
import {define} from 'typeorm-seeding'
import {Product} from "../../entity/Product";

define(Product, () => {
    const product = Product.create({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        des: faker.commerce.productDescription(),
        color: faker.string.uuid(),
        colorName: faker.vehicle.color(),
        imageUrl: faker.image.url(),
        size: faker.commerce.price({min:0, max:12, dec: 0})
    })
    return product
})