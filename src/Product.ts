
import * as Production from "./Production";
import * as Pricing from "./Pricing";
import * as Review from "./Review";

export abstract class Product {
    protected abstract priceCalculator?: Pricing.PriceCalculator;
    protected abstract production?: Production.Production;
    protected abstract frameDictionary?: Review.FrameDictionary;
    public loadPrice(): Promise<number> {
        return this.getOrCreatePriceCalculator().loadPrice();
    };
    public getFrameDictionary(): Review.FrameDictionary {
        return this.getOrCreateFrameDictionary();
    }
    public isProducible(): boolean {
        let production: Production.Production = this.getOrCreateProduction();
        return production.isProducible();
    }
    // TODO: 把production 要給人使用的method包裝成一個public的method
    

    protected getOrCreatePriceCalculator(): Pricing.PriceCalculator {
        if(!this.priceCalculator) return this.createAndSetPriceCalculator();
        return this.priceCalculator;
    }
    protected getOrCreateProduction(): Production.Production {
        if(!this.production) return this.createAndSetProduction();
        return this.production;
    }
    protected getOrCreateFrameDictionary(): Review.FrameDictionary {
        if(!this.frameDictionary) return this.createAndSetFrameDictionary();
        return this.frameDictionary;
    }
    private createAndSetPriceCalculator(): Pricing.PriceCalculator {
        this.priceCalculator = this.createPriceCalculator(); 
        return this.priceCalculator;     
    }
    private createAndSetProduction(): Production.Production {
        this.production = this.createProduction();
        return this.production; 
    }
    private createAndSetFrameDictionary(): Review.FrameDictionary {
        this.frameDictionary = this.createFrameDictionary();
        return this.frameDictionary;
    }
    protected abstract createPriceCalculator(): Pricing.PriceCalculator;
    protected abstract createProduction(): Production.Production;
    protected abstract createFrameDictionary(): Review.FrameDictionary;
}

export class SingleSheet extends Product {
    protected production?: Production.SingleSheetProduction;    
    protected frameDictionary?: Review.SingleSheetFrameDictionary;
    protected createProduction(): Production.Production {
        throw new Error("Method not implemented.");
    }
    protected createFrameDictionary(): Review.SingleSheetFrameDictionary {
        return new Review.SingleSheetFrameDictionary(this);
    }
    protected priceCalculator?: Pricing.SingleSheetHardCodeConfiguratedPriceCalculator;
    protected createPriceCalculator(): Pricing.SingleSheetHardCodeConfiguratedPriceCalculator {
        return new Pricing.SingleSheetHardCodeConfiguratedPriceCalculator(this);
    }

    private frontSide: Page;
    private backSide?: Page;
    constructor(
        public width: number,
        public height: number,
        private isDoubleSided: boolean,
        public paperTexture: Paper,
        public frontSideCoat?: Coat,
        public backSideCoat?: Coat
    ) {
        super();
        this.frontSide = new Page();
        if (this.isDoubleSided) this.backSide = new Page();
    }
    public getIsDoubleSided(): boolean {
        return this.isDoubleSided;
    }
    public setIsDoubleSided(isDoubleSided: boolean): void {
        let hasChanged: boolean = (this.isDoubleSided !== isDoubleSided);
        this.isDoubleSided = isDoubleSided;
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


export class Paper {
    constructor(
        readonly material: PaperMaterial,
        readonly thickness: number,
        readonly isSmooth: boolean, // 表面是否光滑（會影響能否上膜）
        readonly description: string
    ) {}
}

export class PaperMaterial {
    constructor(
        readonly name: string,
        readonly aliases: Array<string>
    ) {}
}

export class Coat {
    constructor (
        readonly name: string,
        readonly chineseName: string
    ) {}
}

export abstract class Book extends Product {
    protected abstract readonly cover: BookCover;
    protected abstract production?: Production.BookProduction;
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
}

abstract class BookCover {

}

class SaddleStichBindingBookCover extends BookCover {

}

export class SaddleStichBindingBook extends Book {

    protected production?: Production.SaddleStichBingingBookProduction;
    protected frameDictionary?: Review.SaddleStichBindindBookFrameDictionary;
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
    protected priceCalculator?: Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator;
    public createPriceCalculator(): Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator {
        return new Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator(this);
    }
    
    bindingStyle = Production.SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
}
