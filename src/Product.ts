
import * as Production from "./Production";
import * as Pricing from "./Pricing";
import * as Review from "./Review";
import { Exclude, Expose, Type } from "class-transformer";
import { BookInterface, BookSubtypeName, CoatInterface, PaperInterface, PaperMaterialInterface, ProductInterface, ProductSubtypeName, PRODUCT_SUBTYPES, SaddleStichBindingBookInterface, SingleSheetInterface } from "./Interfaces";

export const PRODUCT_TYPE_DISCRIMINATOR = {
    property: '__productSubType',
    subTypes: PRODUCT_SUBTYPES
};

@Exclude()
export abstract class Product implements ProductInterface {
    readonly abstract __productSubType: ProductSubtypeName;
    protected abstract _priceCalculator?: Pricing.PriceCalculator;
    protected abstract _production?: Production.Production;
    protected abstract _frameDictionary?: Review.FrameDictionary;
    public loadPrice(): Promise<number> {
        return this.getOrCreatePriceCalculator().loadPrice();
    };
    public get frameDictionary(): Review.FrameDictionary {
        return this.getOrCreateFrameDictionary();
    }
    public isProducible(): boolean {
        let production: Production.Production = this.getOrCreateProduction();
        return production.isProducible();
    }
    // TODO: 把production 要給人使用的method包裝成一個public的method
    public get production(): Production.Production {
        return this.getOrCreateProduction();
    }

    protected getOrCreatePriceCalculator(): Pricing.PriceCalculator {
        if(!this._priceCalculator) return this.createAndSetPriceCalculator();
        return this._priceCalculator;
    }
    protected getOrCreateProduction(): Production.Production {
        if(!this._production) return this.createAndSetProduction();
        return this._production;
    }
    protected getOrCreateFrameDictionary(): Review.FrameDictionary {
        if(!this._frameDictionary) return this.createAndSetFrameDictionary();
        return this._frameDictionary;
    }
    private createAndSetPriceCalculator(): Pricing.PriceCalculator {
        this._priceCalculator = this.createPriceCalculator(); 
        return this._priceCalculator;    
    }
    private createAndSetProduction(): Production.Production {
        this._production = this.createProduction();
        return this._production; 
    }
    private createAndSetFrameDictionary(): Review.FrameDictionary {
        this._frameDictionary = this.createFrameDictionary();
        return this._frameDictionary;
    }
    protected abstract createPriceCalculator(): Pricing.PriceCalculator;
    protected abstract createProduction(): Production.Production;
    protected abstract createFrameDictionary(): Review.FrameDictionary;
}

export class SingleSheet extends Product implements SingleSheetInterface {
    readonly __productSubType: "SingleSheet" = "SingleSheet";
    protected _production?: Production.SingleSheetProduction;    
    protected _frameDictionary?: Review.SingleSheetFrameDictionary;
    protected createProduction(): Production.Production {
        throw new Error("Method not implemented.");
    }
    protected createFrameDictionary(): Review.SingleSheetFrameDictionary {
        return new Review.SingleSheetFrameDictionary(this);
    }
    protected _priceCalculator?: Pricing.SingleSheetHardCodeConfiguratedPriceCalculator;
    protected createPriceCalculator(): Pricing.SingleSheetHardCodeConfiguratedPriceCalculator {
        return new Pricing.SingleSheetHardCodeConfiguratedPriceCalculator(this);
    }

    @Exclude()
    private frontSide: Page;

    @Exclude()
    private backSide?: Page;

    public width: number;
    public height: number;
    private _isDoubleSided: boolean;
    public paper: Paper;

    @Type(() => Coat)
    public frontSideCoat?: Coat;

    @Type(() => Coat)
    public backSideCoat?: Coat;

    constructor(
        width: number,
        height: number,
        isDoubleSided: boolean,
        paperTexture: Paper,
        frontSideCoat?: Coat,
        backSideCoat?: Coat
    ) {
        super();
        this.width = width;
        this.height = height;
        this._isDoubleSided = isDoubleSided;
        this.paper = paperTexture;
        this.frontSideCoat = frontSideCoat;
        this.backSideCoat = backSideCoat;
        this.frontSide = new Page();
        if (this._isDoubleSided) this.backSide = new Page();
    }
    public get isDoubleSided(): boolean {
        return this._isDoubleSided;
    }
    public set isDoubleSided(isDoubleSided: boolean) {
        let hasChanged: boolean = (this._isDoubleSided !== isDoubleSided);
        this._isDoubleSided = isDoubleSided;
        if (hasChanged) {
            if (isDoubleSided) {
                this.backSide = new Page();
            } else {
                this.backSide = undefined;
            }
        }
    }
}

class Page {

}


export class Paper implements PaperInterface {
    constructor(
        readonly material: PaperMaterial,
        readonly thickness: number,
        readonly isSmooth: boolean, // 表面是否光滑（會影響能否上膜）
        readonly description: string
    ) {}
}

export class PaperMaterial implements PaperMaterialInterface {
    constructor(
        readonly name: string,
        readonly aliases: Array<string>
    ) {}
}

export class Coat implements CoatInterface {
    constructor (
        readonly name: string,
        readonly chineseName: string
    ) {}
}

export abstract class Book extends Product implements BookInterface {
    readonly abstract __productSubType: BookSubtypeName
    protected abstract readonly cover: BookCover;
    protected abstract _production?: Production.BookProduction;
    protected innerPages : {
        [pageIndex: number]: Page
    } = {};
    public getBindingStyle(): Production.BookBindingStyle {
        return (this.getOrCreateProduction() as Production.BookProduction).bindingStyle;
    };
    public numberOfInnerPagesIsValid(): boolean {
        return this.getBindingStyle().numberOfInnerPagesIsBindable(this.numberOfPages);
    }
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public coverPaperTexture: Paper,
        public innerPagesPaperTexture: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        ) {
        super();
    }
    public getInnerPages(): { [pageIndex: number]: Page } {
        // lazy init
        if (Object.keys(this.innerPages).length !== this.numberOfPages) {
            this.innerPages = {};
            for (let pageIndex = 1; pageIndex <= this.numberOfPages; pageIndex++) {
                this.innerPages[pageIndex] = new Page();
            }
        }
        return this.innerPages;
    }
    public async loadValidPaperTexturesForInnerPages(): Promise<Array<Paper>> {
        return (this.getOrCreateProduction() as Production.BookProduction).loadValidPaperTexturesForInnerPages();
    }
    public async loadValidPaperTexturesForCover(): Promise<Array<Paper>> {
        return (this.getOrCreateProduction() as Production.BookProduction).loadValidPaperTexturesForCover();
    }
}

abstract class BookCover {

}

class SaddleStichBindingBookCover extends BookCover {

}

export class SaddleStichBindingBook extends Book implements SaddleStichBindingBookInterface {
    readonly __productSubType: "SaddleStichBindingBook" = "SaddleStichBindingBook";
    protected _production?: Production.SaddleStichBingingBookProduction;
    protected _frameDictionary?: Review.SaddleStichBindindBookFrameDictionary;
    bindingStyle = Production.SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
    constructor(
        coverWidth: number, 
        coverHeight: number, 
        numberOfPages: number, 
        coverPaperTexture: Paper,
        innerPagesPaperTexture: Paper, 
        coverCoating?: Coat, 
        innerPageCoating?: Coat
    ) {
        super(
            coverWidth, 
            coverHeight, 
            numberOfPages, 
            coverPaperTexture, 
            innerPagesPaperTexture, 
            coverCoating, 
            innerPageCoating
        );
    }
    
    protected createProduction(): Production.SaddleStichBingingBookProduction {
        return new Production.SaddleStichBingingBookProduction(this);
    }
    protected createFrameDictionary(): Review.FrameDictionary {
        return new Review.SaddleStichBindindBookFrameDictionary(this);
    }
    protected _priceCalculator?: Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator;
    public createPriceCalculator(): Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator {
        return new Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator(this);
    }
    
}


function Demo(): void {

}