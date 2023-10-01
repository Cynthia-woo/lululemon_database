import { Router } from "express";
import {OrderController} from "../controller/OrderController";

const router = Router()


router.get('/', OrderController.all);
router.get('/:orderId', OrderController.one);
router.put('/:orderId', OrderController.update);
router.post('/', OrderController.create);
router.delete('/:orderId', OrderController.delete);
export default router