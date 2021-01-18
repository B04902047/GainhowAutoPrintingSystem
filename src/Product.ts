
import * as Production from "./Production";
import * as Pricing from "./Pricing";
import * as Review from "./Review";

export abstract class Product {
    protected abstract pricingCalculator: Pricing.PriceCalculator;
    protected abstract production: Production.Production;
    protected abstract frameDictionary: Review.FrameDictionary;
    public getOrCreatePriceCalculator(): Pricing.PriceCalculator {
        if(!this.pricingCalculator) this.createAndSetPriceCalculator();
        return this.pricingCalculator;
    }
    public getOrCreateProduction(): Production.Production {
        if(!this.production) this.createAndSetProduction();
        return this.production;
    }
    public getOrCreateFrameDictionary(): Review.FrameDictionary {
        if(!this.frameDictionary) this.createAndSetFrameDictionary();
        return this.frameDictionary;
    }
    private createAndSetPriceCalculator(): void {
        this.pricingCalculator = this.createPriceCalculator();      
    }
    private createAndSetProduction(): void {
        this.production = this.createProduction();   
    }
    private createAndSetFrameDictionary(): void {
        this.frameDictionary = this.createFrameDictionary();
    }
    protected abstract createPriceCalculator(): Pricing.PriceCalculator;
    protected abstract createProduction(): Production.Production;
    protected abstract createFrameDictionary(): Review.FrameDictionary;
}

export class SingleSheet extends Product {    
    protected frameDictionary: Review.SingleSheetFrameDictionary;
    protected createProduction(): Production.Production {
        throw new Error("Method not implemented.");
    }
    protected createFrameDictionary(): Review.SingleSheetFrameDictionary {
        return new Review.SingleSheetFrameDictionary(this);
    }
    protected pricingCalculator: Pricing.SingleSheetHardCodeConfiguratedPriceCalculator;
    protected createPriceCalculator(): Pricing.SingleSheetHardCodeConfiguratedPriceCalculator {
        return new Pricing.SingleSheetHardCodeConfiguratedPriceCalculator(this);
    }

    private frontSide: Page;
    private backSide?: Page;
    constructor(
        public width: number,
        public height: number,
        private isDoubleSided: boolean,
        public paperTexture: PaperTexture,
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

export class PaperTexture {
    constructor(
        readonly material: PaperMaterial,
        readonly thickness: number,
        readonly description: string
    ) {}
}

class PaperMaterial {
    constructor(
        readonly name: string,
        readonly aliases: Array<string>
    ) {}
}

enum CoatStyle {
    GLOSS_LAMINATION = "亮膜",
    MATT_LAMINATION = "霧膜",
    EMBOSSING = "壓紋膜",
    VELVET_LAMINATION = "絲絨膜"
}

abstract class Coat {
    static readonly chineseName: string;
}

/**
 * 亮膜
 */
class GlossLamination extends Coat {
    static readonly chineseName = CoatStyle.GLOSS_LAMINATION;
}

/**
 * 霧膜 
 */
class MattLamination extends Coat {
    static readonly chineseName = CoatStyle.MATT_LAMINATION;
}

/**
 * 壓紋膜
 */
class Embossing implements Coat {
    static readonly chineseName = CoatStyle.EMBOSSING;
}

/**
 * 絲絨膜
 */
class VelvetLamination implements Coat {
    static readonly chineseName = CoatStyle.VELVET_LAMINATION;
}


export abstract class Book extends Product {
    readonly cover : BookCover;
    protected innerPages : {
        [pageIndex: number]: Page
    } = {};
    protected readonly bindingStyle: BindingStyle;
    constructor(
        public coverWidth: number,
        public coverHieght: number,
        public numberOfPages: number,
        public coverPaperTexture: PaperTexture,
        public innerPagesPaperTexture: PaperTexture,
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

abstract class BindingStyle {
}

class ButterflyBinding extends BindingStyle {
    
}

class PerfectBinding extends BindingStyle {
    
}

class SaddleStichBinding extends BindingStyle {
    private static instance: SaddleStichBinding = new SaddleStichBinding();
    private constructor() {
        super();
    }
    public static getInstance(): SaddleStichBinding {
        return SaddleStichBinding.instance;
    };
}


abstract class BookCover {

}

class SaddleStichBindingBookCover extends BookCover {

}

export class SaddleStichBindingBook extends Book {
    protected production: Production.Production;
    
    protected frameDictionary: Review.SaddleStichBindindBookFrameDictionary;
    constructor(
        coverWidth: number, 
        coverHieght: number, 
        numberOfPages: number, 
        coverPaperTexture: PaperTexture, 
        innerPagesPaperTexture: PaperTexture, 
        coverCoating?: Coat, 
        innerPageCoating?: Coat
    ) {
        super(
            coverWidth, 
            coverHieght, 
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
        return  new Review.SaddleStichBindindBookFrameDictionary(this);
    }
    protected pricingCalculator: Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator;
    public createPriceCalculator(): Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator {
        return new Pricing.SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator(this);
    }
    
    bindingStyle = SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
}


interface ConcreteProductEncoding {
    isConcrete: true;
    concreteData: Object;
}

interface AbstractProductEncoding {
    isConcrete: false;
    subclassName: string;
    subclassEncoding: ProductEncoding;
}

export type ProductEncoding = AbstractProductEncoding | ConcreteProductEncoding;

export class ProductEncoder {
    public static toJson(code: ProductEncoding): string {
        return JSON.stringify(code);
    }
    public static fromJson(json: string): ProductEncoding | null {
        let code: any;
        try {
            code = JSON.parse(json);
        } catch {
            return null;
        }
        if (ProductEncoder.isProductEncoding(code)) {
            return code as ProductEncoding;
        }
        return null;
    }
    private static isProductEncoding(code: any): boolean {
        if (code.isConcrete == true) {
            if (code.concreteData == undefined) return false;
            return true;
        }
        if (code.isConcrete == false) {
            if (code.subclassName == undefined
                || code.subclassEncoding == undefined) return false;
            return ProductEncoder.isProductEncoding(code.subclassEncoding);
        }
        return false;
    }
}