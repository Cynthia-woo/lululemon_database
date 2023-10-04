import {faker} from '@faker-js/faker'
import {define} from 'typeorm-seeding'
import {User} from "../../entity/User";

define (User, () => {
    const user = User.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({min:0, max:99}),
        password: faker.internet.password(),
        email: faker.internet.email()
    })
    return user
})