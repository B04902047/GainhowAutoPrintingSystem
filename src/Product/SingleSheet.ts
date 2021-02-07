
import * as Review from "../Review";
import * as Interfaces from "../Interface";
import { Product } from "./Product";
import { Exclude, Type } from "class-transformer";
import { Coat } from "../Material/Coat";
import { Paper } from "../Material/Paper";

export class SingleSheet extends Product implements Interfaces.SingleSheet {
    readonly __productSubType: "SingleSheet" = "SingleSheet";
    
    @Exclude()  
    protected _frameDictionary?: Review.SingleSheetFrameDictionary;

    protected createFrameDictionary(): Review.SingleSheetFrameDictionary {
        return new Review.SingleSheetFrameDictionary(this);
    }

    @Type(() => Coat)
    public frontSideCoat?: Coat;

    @Type(() => Coat)
    public backSideCoat?: Coat;

    constructor(
        public width: number,
        public height: number,
        public isDoubleSided: boolean,
        public paper: Paper,
        frontSideCoat?: Coat,
        backSideCoat?: Coat
    ) {
        super();
        this.frontSideCoat = frontSideCoat;
        this.backSideCoat = backSideCoat;
    }
}