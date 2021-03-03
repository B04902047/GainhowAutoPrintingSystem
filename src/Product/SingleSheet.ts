
import {SingleSheet as SingleSheetInterface} from "../Interface";
import Product from "./Product";
import { Exclude, Type } from "class-transformer";
import Coat from "../Material/Coat";
import Paper from "../Material/Paper";
import SingleSheetFrameDictionary from "../FrameDictionary/SingleSheetFrameDictionary";

export default class SingleSheet extends Product implements SingleSheetInterface {
    readonly __productSubType: "SingleSheet" = "SingleSheet";
    
    @Exclude()
    protected _frameDictionary?: SingleSheetFrameDictionary;

    protected createFrameDictionary(): SingleSheetFrameDictionary {
        return new SingleSheetFrameDictionary(this);
    }

    @Type(() => Paper)
    public paper: Paper;

    @Type(() => Coat)
    public frontSideCoat?: Coat;

    @Type(() => Coat)
    public backSideCoat?: Coat;

    constructor(
        public width: number,
        public height: number,
        public isDoubleSided: boolean,
        paper: Paper,
        frontSideCoat?: Coat,
        backSideCoat?: Coat
    ) {
        super();
        this.paper = paper;
        this.frontSideCoat = frontSideCoat;
        this.backSideCoat = backSideCoat;
    }
}