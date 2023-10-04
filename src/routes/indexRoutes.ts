import {Router} from 'express'
import ProductRoutes from "./productRoutes";
import OrderRoutes from "./orderRoutes";

const indexRoutes: Router = Router()
indexRoutes.use('/product', ProductRoutes)
indexRoutes.use('/order', OrderRoutes)

export default indexRoutes