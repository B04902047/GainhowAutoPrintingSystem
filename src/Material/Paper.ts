import { Type } from "class-transformer";
import { Paper as PaperInterface } from "../Interface";
import PaperMaterial from "./PaperMaterial";

export default class Paper implements PaperInterface {

    @Type(() => PaperMaterial)
    readonly material: PaperMaterial;
    constructor(
        readonly name: string,
        material: PaperMaterial,        // 材質
        readonly thickness: number,     // 厚度（mm）
        readonly weight: number,        // 單位面積重（g/m^2）
        readonly isSmooth: boolean,     // 表面是否光滑（會影響能否上膜）
        readonly description?: string
    ) {
        this.material = material;
    }
}