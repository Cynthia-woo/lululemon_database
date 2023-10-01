import {Router} from "express";
import user from "./user";
import products from "./products";

const routes = Router()

routes.use("/user", user)
routes.use("/products", products)
// routes.use("/order", user)

export default routes