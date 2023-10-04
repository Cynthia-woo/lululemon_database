import {Message, StatusCode} from "./StatusCode";

export class Err<T> {
    constructor(
        public data: T,
        public statusCode: StatusCode,
        public message: Message
    ){
        this.data = data;
        this.statusCode = statusCode;
        this.message = message
    }
}