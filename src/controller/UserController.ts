import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from "../entity/User";
import {validate} from "class-validator";
import {Err, ErrStr, HttpCode} from "../helper/Err";

export class UserController {

    public static get repo(){
        return getRepository(User)
    }

    static async create(req:Request, res:Response, next:NextFunction){
        let {firstName, lastName, age, email, password} = req.body
        let user = new User()
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password
        user.isStaff = false

        try {
            const errors = await validate(user)
            if (errors.length > 0){
                let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter)
                return res.status(400).send(errors)
            }

            await UserController.repo.save(user)
        } catch (e) {
            console.log('Error while writing BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err())
    }

    static async all (req, res, next){
        let users = []
        try {
            users = await UserController.repo.find()
        } catch (e){
            console.log('Error while finding BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK, users))
    }

    static async one (req, res, next){
        const {userId} = req.params
        if (!userId){
            return res.status(404).send(new Err(HttpCode.E404, ErrStr.ErrNoObj))
        }

        let users = null
        try {
            users = await UserController.repo.findOneOrFail(userId)
        } catch (e){
            console.log('Error while finding BD:', e)
            return res.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        }
        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK, users))
    }

    static async update(req, res, next){
        const {userId} = req.params
        if (!userId){
            return res.status(404).send(new Err(HttpCode.E404, ErrStr.ErrNoObj))
        }

        let user = null
        try {
            user = await UserController.repo.findOneOrFail(userId)
        } catch (e){
            console.log('Error while finding user:', e)
            return res.status(400).send(new Err(HttpCode.E404, ErrStr.ErrStore, e))
        }

        let {firstName, lastName, age, email, password} = req.body
        user.firstName = firstName
        user.lastName = lastName
        user.age = age
        user.email = email
        user.password = password
        user.isStaff = false

        const errors = await validate(user)
        if (errors.length > 0){
            let err = new Err(HttpCode.E400, ErrStr.ErrMissingParameter, errors)
            return res.status(400).send(errors)
        }

        try{
            await UserController.repo.save(user)
        } catch (e) {
            console.log('Error while writing BD:', e)
            return res.status(400).send(new Err(HttpCode.E400, ErrStr.ErrStore, e))
        }

        return res.status(200).send(new Err(HttpCode.E200, ErrStr.OK))

    }

    static async delete(req, res, next){

    }

}