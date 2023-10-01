import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {Order} from "../entity/Order";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {IdCheckRes, MkController} from "./MkController";
import {UserController} from "./UserController";
import {ProductController} from "./ProductController";
import {Product} from "../entity/Product";
import {User} from "../entity/User";

export class OrderController extends MkController{

    public static get repo(){
        return getRepository(Order)
    }

    static async validateOrder(user:number, products: number[]){
        if ((typeof user !== 'number') || user <= 0 || !Array.isArray(products)){
            throw (new Err(HttpCode.E400, 'Invalid user or products ID'))
        }

        let result:IdCheckRes[] = []

        try {
            let temp = await OrderController.checkIdExist([user], UserController.repo)
            if (temp.index !== -1){
                throw (new Err(HttpCode.E400, 'Invalid user id ' + temp.index))
            }
            result.push(temp)
            temp = await OrderController.checkIdExist(products, ProductController.repo)
            if (temp.index !== -1){
                throw (new Err(HttpCode.E400, 'Invalid product id ' + temp.index))
            }
            result.push(temp)
        } catch (e) {
            throw (new Err(HttpCode.E400, 'Invalid product ids'))
        }

        return result
    }

    static createOrder = async (req:Request, res:Response) =>{
        const {
            productIds,
            userId
        } = req.body

        // const products:Product[] = productIds.map(async productId => {
        //     return await getRepository(Product)
        //         .createQueryBuilder('product')
        //         .where('product.id = productId', {productId})
        //         .getOne()
        // })

        let products:Product[]
        for (const productId of productIds ){
            const product = await getRepository(Product)
                .createQueryBuilder('product')
                .where('product.id = productId',{productId})
                .getOne()
            products.push(product)
        }

        const isValid = products.filter(product => !!product)
        if (isValid !== productIds.length) res.status(404).send({message:"not found"})


        const user:User = await getRepository(User)
            .createQueryBuilder('user')
            .where('user.id = :userId', {userId})
            .getOne()
        if (!user) return res.status(404).send({message:"not found"})

        const newOrder = Order.create({
            products,
            user
        })

        const errors = await validate(newOrder)
        if (errors.length > 0){
            return  res.status(400).send({message:"error"})
        }
        await newOrder.save()
        return res.status(200).send({message:"good"})

    }

    static async create(req:Request, res:Response, next:NextFunction){
        let {price,totalPrice,taxRate, user, products} = req.body
        let order = new Order()
        order.price = price
        order.totalPrice = totalPrice
        order.taxRate = taxRate

        try {
            const errors = await validate(order)
            if (errors.length > 0){
                let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return res.status(400).send(errors)
            }

            let result = await OrderController.validateOrder(user, products)
            order.user = result[0].entities[0]
            order.products = result[1].entities

            await OrderController.repo.save(order)
        } catch (e) {
            console.log('Error while writing BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err())
    }

    static async queryAllOrders (req:Request, res:Response){
        try{
            const orders = await getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.products','product')
                .innerJoinAndSelect('order.user','user')
                .getMany()
            return res.status(200).send(orders)
        } catch (e) {
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

    }
    static async all (req, res, next){
        let orders = []
        try {
            orders = await OrderController.repo.find()
        } catch (e){
            console.log('Error while finding BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }

    static async quereyOrderByOrderId (req, res) {
        const {orderId} = req.params
        const order = await getRepository(Order)
            .createQueryBuilder('order')
            .where('order.id =:orderId', {orderId})
            .getOne()

        return res.status(200).send(order)
    }

    static async one (req, res, next){
        const {orderId} = req.params
        if (!orderId){
            return res.status(404).send(new Err(HttpCode.E404, ErrStr.ErrNoObj))
        }

        let orders = null
        try {
            orders = await OrderController.repo.findOneOrFail(orderId)
        } catch (e){
            console.log('Error while finding BD:', e)
            return res.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK, orders))
    }

    static async update(req, res, next){
        const {orderId} = req.params
        if (!orderId){
            return res.status(404).send(new Err(HttpCode.E404, ErrStr.ErrNoObj))
        }

        let order = null
        try {
            order = await OrderController.repo.findOneOrFail(orderId)
        } catch (e){
            console.log('Error while finding order:', e)
            return res.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        }

        let {price,totalPrice,taxRate} = req.body
        order.price = price
        order.totalPrice = totalPrice
        order.taxRate = taxRate
        order.taxRate = taxRate
        order.isActive = true

        const errors = await validate(order)
        if (errors.length > 0){
            let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors)
            return res.status(400).send(errors)
        }

        try{
            await OrderController.repo.save(order)
        } catch (e) {
            console.log('Error while writing BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK))
    }

    static async delete(req, res, next){

    }


}