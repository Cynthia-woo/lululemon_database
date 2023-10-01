import {NextFunction, Request, Response} from "express";
import {Product} from "../entity/Product";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";
import {getRepository} from "typeorm";

export class ProductController {

    public static get repo(){
        return getRepository(Product)
    }

    static async create(req:Request, res:Response, next:NextFunction){
        let {name,price,media,slug,description} = req.body
        let product = new Product()
        product.name = name
        product.price = price
        product.media = media
        product.slug = slug
        product.description = description
        product.isActive = true

        try {
            const errors = await validate(product)
            if (errors.length > 0){
                let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return res.status(400).send(errors)
            }

            await ProductController.repo.save(product)
        } catch (e) {
            console.log('Error while writing BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err())
    }

    static async all (req, res, next){
        let products:Product[] = []
        try {
            products = await ProductController.repo.find()
        } catch (e){
            console.log('Error while finding BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK, products))
    }

    static async one (req, res, next){
        const {productId} = req.params
        if (!productId){
            return res.status(404).send(new Err(HttpCode.E404, ErrStr.ErrNoObj))
        }

        let product = null
        try {
            product = await ProductController.repo.findOneOrFail(productId)
        } catch (e){
            console.log('Error while finding BD:', e)
            return res.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK, product))
    }

    static async update(req, res, next){
        const {productId} = req.params
        if (!productId){
            return res.status(404).send(new Err(HttpCode.E404, ErrStr.ErrNoObj))
        }

        let product = null
        try {
            product = await ProductController.repo.findOneOrFail(productId)
        } catch (e){
            console.log('Error while finding product:', e)
            return res.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        }

        let {name,price,media,slug,description} = req.body
        product.name = name
        product.price = price
        product.media = media
        product.slug = slug
        product.description = description

        const errors = await validate(product)
        if (errors.length > 0){
            let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors)
            return res.status(400).send(errors)
        }

        try{
            await ProductController.repo.save(product)
        } catch (e) {
            console.log('Error while writing BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK))

    }

    static async delete(req, res, next){

    }


}