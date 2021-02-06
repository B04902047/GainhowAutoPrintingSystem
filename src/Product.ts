
import * as Production from "./Production";
import * as Pricing from "./Pricing";
import * as Review from "./Review";
import * as Interfaces from "./Interfaces";
import { Exclude, Expose, Type } from "class-transformer";

export const PRODUCT_TYPE_DISCRIMINATOR = {
    property: '__productSubType',
    subTypes: Interfaces.PRODUCT_SUBTYPES
};

@Exclude()
export abstract class Product implements Product {
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
    // TODO: 要不要把production 要給人使用的method包裝成一個public的method？
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

export class SingleSheet extends Product implements SingleSheet {
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


export class Paper implements Paper {
    constructor(
        readonly material: PaperMaterial,
        readonly thickness: number,
        readonly isSmooth: boolean, // 表面是否光滑（會影響能否上膜）
        readonly description: string
    ) {}
}

export class PaperMaterial implements PaperMaterial {
    constructor(
        readonly name: string,
        readonly aliases: Array<string>
    ) {}
}

export class Coat implements Coat {
    constructor (
        readonly name: string,
        readonly chineseName: string
    ) {}
}

export abstract class Book extends Product implements Book {
    readonly abstract __productSubType: Interfaces.BookSubtypeName
    protected abstract readonly cover: BookCover;
    protected abstract _production?: Production.BookProduction;
    protected innerPages : {
        [pageIndex: number]: Page
    } = {};
    public get production(): Production.BookProduction {
        return this.getOrCreateProduction() as Production.BookProduction;
    }
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
        public pagingDirection: Interfaces.BookPagingDirection,
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
}

abstract class BookCover {

}

class SaddleStichBindingBookCover extends BookCover {

}

export class SaddleStichedBook extends Book implements Interfaces.SaddleStichedBook {
    readonly __productSubType: "SaddleStichBindingBook" = "SaddleStichBindingBook";
    protected _production?: Production.SaddleStichBindingBookProduction;
    protected _frameDictionary?: Review.SaddleStichBindindBookFrameDictionary;
    bindingStyle = Production.SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
    constructor(
        coverWidth: number, 
        coverHeight: number, 
        numberOfPages: number,
        pagingDirection: Interfaces.BookPagingDirection,
        coverPaperTexture: Paper,
        innerPagesPaperTexture: Paper, 
        coverCoating?: Coat, 
        innerPageCoating?: Coat
    ) {
        super(
            coverWidth, 
            coverHeight, 
            numberOfPages,
            pagingDirection,
            coverPaperTexture, 
            innerPagesPaperTexture, 
            coverCoating, 
            innerPageCoating
        );
    }
    public get production(): Production.SaddleStichBindingBookProduction {
        return this.getOrCreateProduction() as Production.SaddleStichBindingBookProduction;
        // TODO: rewrite createAndSetProduction() in concrete products
    }
    protected createProduction(): Production.SaddleStichBindingBookProduction {
        return new Production.SaddleStichBindingBookProduction(this);
    }
    protected createFrameDictionary(): Review.FrameDictionary {
        return new Review.SaddleStichBindindBookFrameDictionary(this);
    }
    protected _priceCalculator?: Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator;
    public createPriceCalculator(): Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator {
        return new Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator(this);
    }
    
}

abstract class PerfectBoundBook extends Book implements Interfaces.PerfectBoundBook {
    readonly __productSubType = "PerfectBoundBook";
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public pagingDirection: Interfaces.BookPagingDirection,
        public coverPaperTexture: Paper,
        public innerPagesPaperTexture: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        public hardCovered: boolean = false,
        public threadSewn: boolean = false,
        public spineStyle: "standard" | "rounded" = "standard",
    ) {
        super(
            coverWidth,
            coverHeight,
            numberOfPages,
            pagingDirection,
            coverPaperTexture,
            innerPagesPaperTexture,
            coverCoating,
            innerPageCoating
        );
    }
}

class SoftCoveredPerfectBoundBook extends PerfectBoundBook {
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public pagingDirection: Interfaces.BookPagingDirection,
        public coverPaperTexture: Paper,
        public innerPagesPaperTexture: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        public threadSewn: boolean = false,
    ) {
        super(
            coverWidth,
            coverHeight,
            numberOfPages,
            pagingDirection,
            coverPaperTexture,
            innerPagesPaperTexture,
            coverCoating,
            innerPageCoating,
            false,
            threadSewn,
            "standard"
        );
    }
}

class HardCoveredPerfectBoundBook extends PerfectBoundBook {
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public pagingDirection: Interfaces.BookPagingDirection,
        public coverPaperTexture: Paper,
        public innerPagesPaperTexture: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        public threadSewn: boolean = false,
        public spineStyle: "standard" | "rounded" = "standard",
    ) {
        super(
            coverWidth,
            coverHeight,
            numberOfPages,
            pagingDirection,
            coverPaperTexture,
            innerPagesPaperTexture,
            coverCoating,
            innerPageCoating,
            true,
            threadSewn,
            spineStyle
        );
    }
}