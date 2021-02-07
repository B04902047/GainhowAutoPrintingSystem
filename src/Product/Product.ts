
import * as Review from "../Review";
import * as Interface from "../Interface";

export abstract class Product implements Interface.Product {
    readonly abstract __productSubType: Interface.ProductSubtypeName;
    protected abstract _frameDictionary?: Review.FrameDictionary;
    static Coat: any;
    public get frameDictionary(): Review.FrameDictionary {
        return this.getOrCreateFrameDictionary();
    }
    protected getOrCreateFrameDictionary(): Review.FrameDictionary {
        if(!this._frameDictionary) return this.createAndSetFrameDictionary();
        return this._frameDictionary;
    }
    private createAndSetFrameDictionary(): Review.FrameDictionary {
        this._frameDictionary = this.createFrameDictionary();
        return this._frameDictionary;
    }
    protected abstract createFrameDictionary(): Review.FrameDictionary;
}