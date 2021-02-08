
import { Coat as CoatInterface } from "../Interface";

export default class Coat implements CoatInterface {
    constructor (
        readonly name: string,
        readonly chineseName: string
    ) {}
}