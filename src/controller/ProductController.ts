import {Response, Request} from 'express'
import {createQueryBuilder, getRepository} from "typeorm";
import {Product} from "../entity/Product";
import {Message, StatusCode} from "../util/StatusCode";
import {User} from "../entity/User";
import {validate} from "class-validator";
export class ProductController{
    static async queryAllProducts (req:Request, res:Response) {
        try{
            const allProducts: Product[] = await getRepository(Product)
                .createQueryBuilder('product')
                .innerJoinAndSelect('product.user','user')
                .getMany()
            console.log(allProducts)
            return res.status(StatusCode.E200).send(allProducts)
        }catch (e) {
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }

    static async queryProductById (req:Request, res:Response){
        try{
            const { productId } = req.params
            const product: Product = await getRepository(Product)
                .createQueryBuilder('product')
                .where('product.id = :productId', { productId })
                .getOne()
            if (!product) {
                return res.status(StatusCode.E400).send('PRODUCT NOT FOUND')
            }
            console.log(product)
            return res.status(StatusCode.E200).send(product)
        }catch (e) {
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }

    static async createProduct (req: Request, res: Response) {
        try {
            const{price,
                des,
                name,
                color,
                colorName,
                imageUrl,
                size,
                userId
            } = req.body

            const user = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.id = :userId', {userId})
                .getOne()
            if(!user){
                return res.status(StatusCode.E400).send('USER NOT FOUND')
            }
            const newProduct: Product = Product.create({
                price,
                des,
                name,
                color,
                colorName,
                imageUrl,
                size,
                user
            })

            const errors = await validate(newProduct)
            if(errors.length > 0 ){
                return res.status(StatusCode.E400).send({
                    message: Message.ErrParams
                })
            }

            await newProduct.save()
            console.log(newProduct)
            return res.status(StatusCode.E200).send(
                'CREATED PRODUCT SUCCESS',
                newProduct
            )


        }catch (e) {
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }

    static async updateProductById (req: Request, res: Response) {
        try {
            const {productId} = req.params
            const{price,
                des,
                name,
                color,
                colorName,
                imageUrl,
                size,
                userId
            } = req.body

            const product: Product = await getRepository(Product)
                .createQueryBuilder('product')
                .where('product.id = :productId', {productId})
                .getOne()

            const user = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.id = :userId', {userId})
                .getOne()
            if(!product || !user){
                return res.status(StatusCode.E400).send('NOT FOUND')
            }

            const updatedProduct: Product = Product.create({
                price,
                des,
                name,
                color,
                colorName,
                imageUrl,
                size,
                user
            })

            const errors = await validate(updatedProduct,{
                skipMissingProperties: true
            })
            if(errors.length > 0 ){
                return res.status(StatusCode.E400).send({
                    message: Message.ErrParams
                })
            }

            console.log(updatedProduct)
            await createQueryBuilder('product')
                .update(Product)
                .set({
                    price,
                    des,
                    name,
                    color,
                    colorName,
                    imageUrl,
                    size,
                    user
                }).where('product.id = :productId', {productId})
                .execute()

            return res.status(StatusCode.E200).send(
                'UPDATED PRODUCT SUCCESS',
                updatedProduct
            )
        }catch (e) {
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }

    static async deleteProductById (req: Request, res: Response) {
        try {
            const {productId} = req.params

            const product: Product = await getRepository(Product)
                .createQueryBuilder('product')
                .where('product.id = :productId', {productId})
                .getOne()

            if(!product){
                return res.status(StatusCode.E400).send('PRODUCT NOT FOUND')
            }


            await createQueryBuilder('product')
                .update(Product)
                .set({
                    isDelete: true
                }).where('product.id = :productId', {productId})
                .execute()

            return res.status(StatusCode.E200).send(
                'DELETE PRODUCT DONE',
            )
        }catch (e) {
            return res.status(StatusCode.E500).send({
                message: Message.ServerErr
            })
        }
    }

}