
import * as Production from "./Production";
import * as Pricing from "./Pricing";
import * as Review from "./Review";

export abstract class Product {
    public abstract getOrCreatePriceCalculator(): Pricing.PriceCalculator;
    public abstract getOrCreateProduction(): Production.Production;
    public abstract getOrCreateFrameDictionary(): Review.FrameDictionary;
}

export class SingleSheet extends Product {
    private frontSide: Page;
    private backSide?: Page;
    constructor(
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
    public getOrCreatePriceCalculator(): Pricing.PriceCalculator {

    };
    public getOrCreateProduction(): Production.Production {

    };
    public getOrCreateFrameDictionary(): Review.FrameDictionary {

    };
}

class Page {

}

class PaperTexture {
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
    public getOrCreatePriceCalculator(): Pricing.PriceCalculator {

    };
    public getOrCreateProduction(): Production.Production {

    };
    public getOrCreateFrameDictionary(): Review.FrameDictionary {

    };

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

class SaddleStichBindingBook extends Book {
    bindingStyle = SaddleStichBinding.getInstance();
    cover = new SaddleStichBindingBookCover();
}