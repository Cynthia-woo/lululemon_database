import { Router } from "express";
import {ProductController} from "../controller/ProductController";

const router : Router = Router()


router.get('/', ProductController.all);
router.get('/:productId', ProductController.one);
router.put('/:productId', ProductController.update);
router.post('/', ProductController.create);
router.delete('/:productId', ProductController.delete);
export default router