import {Router} from 'express'
import {OrderController} from "../controller/OrderController";

const orderRoutes : Router = Router()
orderRoutes.get('/', OrderController.queryAllOrders)
orderRoutes.get('/:orderId', OrderController.queryOrderById)
orderRoutes.post('/', OrderController.createOrder)


export default orderRoutes