import { Router } from "express";
import {UserController} from "../controller/UserController";

const router = Router()


router.get('/', UserController.all);
router.get('/:userId', UserController.one);
router.put('/:userId', UserController.update);
router.post('/', UserController.create);
router.delete('/:userId', UserController.delete);
export default router