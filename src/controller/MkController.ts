
export interface IdCheckRes {
    index : number
    entities : any[]
}
export class MkController{
    public static async checkIdExist(ids:number[], repo:any):Promise<IdCheckRes> {
        let index = 0
        let entities = []

        let result:IdCheckRes = {
            index : -1,
            entities
        }

        for (index = 0; index <= ids.length; index++){
            try{
                let entity = await repo.findOneOrFail(ids[index])
                result.entities.push(entity)
            } catch (e) {
                break
            }
        }
        if (index === ids.length){
            result.index = -1
        } else {
            result.index = ids[index]
        }
        return result
    }
}