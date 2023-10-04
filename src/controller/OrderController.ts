import {Request, Response} from 'express'
import {getRepository} from "typeorm";
import {Order} from "../entity/Order";
import {Message, StatusCode} from "../util/StatusCode";
import {Product} from "../entity/Product";
import {User} from "../entity/User";
import {validate} from "class-validator";
export class OrderController{
    static async queryAllOrders (req: Request, res: Response){
        try{
            const allOrders: Order[] = await getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.products', 'product')
                .innerJoinAndSelect('order.user','user')
                .getMany()
            // console.log(allOrders)
            return res.status(StatusCode.E200).send(allOrders)
        }catch(e){
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }

    static async queryOrderById (req: Request, res: Response){
        try{
            const {orderId} = req.params

            // verify the existence of order
            const order:Order = await getRepository(Order)
                .createQueryBuilder('order')
                .where('order.id = :orderId', {orderId})
                .getOne()
            if (!order) {
                return res.status(StatusCode.E400).send('ORDER NOT FOUND')
            }

            // output
            return res.status(200).send({
                order
            })

        }catch(e){
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }
    static async createOrder (req: Request, res: Response){
        try{
            const {productIds, userId} = req.body

            // verify the existence of products
            // const products: Product[] = []

            // for (const productId of productIds) {
            //     const product = await getRepository(Product)
            //         .createQueryBuilder('product')
            //         .where('product.id = :productId', {productId})
            //         .getOne()
            //     // console.log(product)
            //     products.push(product)
            // }

            const products: Product[] = await Promise.all(productIds.map( productId => {
                return getRepository(Product)
                    .createQueryBuilder('product')
                    .where('product.id = :productId', {productId})
                    .getOne()
            }))

            const validateProducts = products.filter(value => value != undefined )
            if (productIds.length !== validateProducts.length){
                return res.status(404).send({
                    message:'NOT FOUND'
                })
            }

            // verify the existence of user / default user

            let user:User = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.id = :userId', {userId: "187532ca-0aa9-4991-96cc-cc578c343aef"})
                .getOne()
            if (userId){
                user = await getRepository(User)
                    .createQueryBuilder('user')
                    .where('user.id = :userId', {userId})
                    .getOne()
                if (!user) {
                    return res.status(StatusCode.E400).send('User NOT FOUND')
                }
            }

            // calculate total price3
            let totalPrice = 0;
            products.map(product => {totalPrice += parseFloat(product.price)})
            const strTotalPrice = totalPrice.toFixed(2).toString()
            // console.log(strTotalPrice)

            // create new order
            const newOrder: Order = await Order.create({
                totalPrice: strTotalPrice,
                user,
                products
            })

            // validate order
            const errors = await validate(newOrder,{skipMissingProperties: true})
            if (errors.length > 0 ){
                console.log('INVALID PARAMS', errors)
                return res.status(404).send({
                    message: 'INVALID PARAMS'
                })
            }

            console.log('NEW ORDER', newOrder);

            // save order
            try {
                const savedOrder = await newOrder.save();
                console.log('CREATE ORDER SUCCESS', savedOrder);

                return res.status(200).send({
                    savedOrder
                })
            } catch (error) {
                console.error('ERROR WHEN CREATING ORDER', error);
            }


        }catch(e){
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }
}