
import {Coat as CoatInterface} from "../Interface";

export class Coat implements CoatInterface {
    constructor (
        readonly name: string,
        readonly chineseName: string
    ) {}
}