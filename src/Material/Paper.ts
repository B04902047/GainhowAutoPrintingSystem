import { Type } from "class-transformer";
import {Paper as PaperInterface} from "../Interface";
import { PaperMaterial } from "./PaperMaterial";


export class Paper implements PaperInterface {

    @Type(() => PaperMaterial)
    readonly material: PaperMaterial;
    constructor(
        readonly name: string,
        material: PaperMaterial,
        readonly thickness: number,
        readonly weight: number,
        readonly isSmooth: boolean,     // 表面是否光滑（會影響能否上膜）
        readonly description?: string
    ) {
        this.material = material;
    }
}