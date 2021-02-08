
import { PaperMaterial as PaperMaterialInterface } from "../Interface";

export default class PaperMaterial implements PaperMaterialInterface {
    constructor(
        readonly name: string,
        readonly aliases?: Array<string>
    ) {}
}