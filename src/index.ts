import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {User} from "./entity/User";
import indexRoutes from "./routes/indexRoutes";
import {ProductController} from "./controller/ProductController";
import {Product} from "./entity/Product";
import {validate} from "class-validator";
import {Message, StatusCode} from "./util/StatusCode";

createConnection().then(async connection => {

    //get the product information
    // const fs = require('fs')
    // const jsonData = fs.readFileSync('./lulu.json', "utf-8")
    // const data = JSON.parse(jsonData)
    //
    // const user = await getRepository(User)
    //     .createQueryBuilder('user')
    //     .where('user.id = :userId', {userId: "187532ca-0aa9-4991-96cc-cc578c343aef"})
    //     .getOne()
    //
    // console.log(data.rs.products.length)
    // for (let i = 0; i < 10; i++) {
    //     let product = data.rs.products[i]
    //     console.log('------------')
    //     const newProduct = Product.create({
    //         productId:product.productId,
    //         price: product.price,
    //         des: product.whyWeMadeThis,
    //         name: product.name,
    //         color: product.swatches[0].swatch,
    //         colorName: product.swatches[0].swatchAlt,
    //         imageUrl: product.images[0].whyWeMadeThis[0],
    //         size: product.sizes[0].details[0]??'FREE',
    //         user
    //     })
    //     const errors = await validate(newProduct)
    //     if (errors.length === 0){
    //         console.log('CREATED PRODUCT SUCCESS', newProduct)
    //         await newProduct.save()
    //     }else{console.log(errors)}
    // }

    // data.rs.products.map(async product => {
    //     console.log('------------')
    //     const newProduct = Product.create({
    //         price: product.price,
    //         des: product.whyWeMadeThis,
    //         name: product.name,
    //         color: product.swatches[0].swatch,
    //         colorName: product.swatches[0].swatchAlt,
    //         imageUrl: product.images[0].whyWeMadeThis[0],
    //         size: product.sizes[0].details[0],
    //         user
    //     })
    //     const errors = await validate(newProduct)
    //     if (errors.length === 0){
    //         console.log('CREATED PRODUCT SUCCESS', newProduct)
    //     }else{console.log(errors)}
    // })

    // const newProduct: Product = Product.create({
    //     price:data.rs.products[0].price,
    //     des:data.rs.products[0].whyWeMadeThis,
    //     name:data.rs.products[0].name,
    //     color:data.rs.products[0].swatches[0].swatch,
    //     colorName:data.rs.products[0].swatches[0].swatchAlt,
    //     imageUrl:data.rs.products[0].images[0].whyWeMadeThis[0],
    //     size:data.rs.products[0].sizes[0].details[0],
    //     user
    // })
    // const errors = await validate(newProduct)
    // if (errors.length === 0){
    //     console.log('CREATED PRODUCT SUCCESS', newProduct)
    // }else{console.log(errors)}
    // await newProduct.save()


    const cors = require('cors');

    // create express app
    const app = express();
    const corsOptions = {
        methods: 'GET,POST,PUT,DELETE',
    };
    app.use(bodyParser.json());
    // 允许使用所有的 HTTP 请求方法
    app.use(cors(corsOptions))
    app.use(indexRoutes)


    // start express server
    app.listen(3000);



    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
