import { Book } from "./Book";
import {SaddleStichedBook as SaddleStichedBookInterface} from "../Interface";

export class SaddleStichedBook extends Book implements SaddleStichedBookInterface {
    readonly __productSubType: "SaddleStichedBook" = "SaddleStichedBook";
    protected _frameDictionary?: Review.SaddleStichBindindBookFrameDictionary;
    bindingStyle = Production.SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
    constructor(
        coverWidth: number, 
        coverHeight: number, 
        numberOfPages: number,
        pagingDirection: Interface.BookPagingDirection,
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
}


export class SaddleStichedBook extends Book implements Interface.SaddleStichedBook {
    readonly __productSubType: "SaddleStichBindingBook" = "SaddleStichBindingBook";
    protected _production?: Production.SaddleStichBindingBookProduction;
    protected _frameDictionary?: Review.SaddleStichBindindBookFrameDictionary;
    bindingStyle = Production.SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
    constructor(
        coverWidth: number, 
        coverHeight: number, 
        numberOfPages: number,
        pagingDirection: Interface.BookPagingDirection,
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
