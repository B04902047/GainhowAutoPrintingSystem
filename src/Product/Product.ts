

import * as Interface from "../Interface";
import FrameDictionary from "../FrameDictionary/FrameDictionary";
import { Exclude } from "class-transformer";

@Exclude()
export default abstract class Product implements Interface.Product {
    readonly abstract __productSubType: Interface.ProductSubtypeName;
    protected abstract _frameDictionary?: FrameDictionary;
    public get frameDictionary(): FrameDictionary {
        return this.getOrCreateFrameDictionary();
    }
    protected getOrCreateFrameDictionary(): FrameDictionary {
        if(!this._frameDictionary) return this.createAndSetFrameDictionary();
        return this._frameDictionary;
    }
    private createAndSetFrameDictionary(): FrameDictionary {
        this._frameDictionary = this.createFrameDictionary();
        return this._frameDictionary;
    }
    protected abstract createFrameDictionary(): FrameDictionary;
}