import {Router} from 'express';
import {ProductController} from "../controller/ProductController";

const productRoutes: Router = Router();
productRoutes.get('/', ProductController.queryAllProducts)
productRoutes.get('/:productId', ProductController.queryProductById)
productRoutes.post('/', ProductController.createProduct)
productRoutes.put('/:productId', ProductController.updateProductById)
productRoutes.delete('/:productId', ProductController.deleteProductById)

export default productRoutes