import * as Product from './Product';

export interface Production {
    isProducible(): boolean;
}

export class SingleSheetProduction implements Production {
    isProducible(): boolean {
        throw new Error('Method not implemented.');
    }
}

export abstract class BookProduction implements Production {
    abstract readonly bindingStyle: BookBindingStyle;
    constructor(
        protected readonly product: Product.Book
    ) {}
    isProducible(): boolean {  //不知道要不要在這裡，或是往下傳
        throw new Error('Method not implemented.');
    }

    public abstract estimateSpineWidth(): number;
    protected abstract innerPageShouldCoat(): boolean;
    protected abstract coverShouldCoat(): boolean;
    

    protected validPaperTextureForInnerPages: Array<Product.Paper> = [];  //不要lazy innt? => 使用者拉開下拉選單的時候會等待一下才有東西，使用體驗不好? 但是先init的話，不知道要取得的時候，資料已經回來了沒有
    protected validPaperTextureForCover: Array<Product.Paper> = [];
    
    // 待討論
    public async getValidPaperTexturesForInnerPages(): Promise<Array<Product.Paper>> {
        if (!this.validPaperTextureForInnerPages) await this.createAndSetValidPaperTextureForInnerPages();
        return Promise.resolve(this.validPaperTextureForInnerPages);
    }
    public async getValidPaperTexturesForCover(): Promise<Array<Product.Paper>> {
        if (!this.validPaperTextureForCover) await this.createAndSetValidPaperTextureForCover();
        return Promise.resolve(this.validPaperTextureForCover);
    }
    
    protected async createAndSetValidPaperTextureForInnerPages(): Promise<void> {
        this.validPaperTextureForInnerPages = await this.loadValidPaperTextureForInnerPages();
    }
    protected async createAndSetValidPaperTextureForCover(): Promise<void> {
        this.validPaperTextureForCover = await this.loadValidPaperTextureForCover();
    }
    protected abstract loadValidPaperTextureForInnerPages(): Promise<Array<Product.Paper>>;
    protected abstract loadValidPaperTextureForCover(): Promise<Array<Product.Paper>>;

}

export class SaddleStichBingingBookProduction extends BookProduction {
    readonly bindingStyle: SaddleStichBinding = SaddleStichBinding.getInstance();
    public estimateSpineWidth(): number { return 0; }
    protected innerPageShouldCoat(): boolean { return false; }
    protected coverShouldCoat(): boolean { return true; }
    protected loadValidPaperTextureForInnerPages(): Promise<Product.Paper[]> {
        throw new Error('Method not implemented.');
    }
    protected loadValidPaperTextureForCover(): Promise<Product.Paper[]> {
        throw new Error('Method not implemented.');
    }
}

export abstract class BookBindingStyle {
    public abstract numberOfInnerPagesIsBindable(numberOfInnerPages: number): boolean;
    public abstract getDescriptionOfTheNumberOfInnerPageRestriction(): string;
}

class ButterflyBinding extends BookBindingStyle {
    
}

class PerfectBinding extends BookBindingStyle {
    
}

export class SaddleStichBinding extends BookBindingStyle {
    private static instance: SaddleStichBinding = new SaddleStichBinding();
    private constructor() {
        super();
    }
    public static getInstance(): SaddleStichBinding {
        return SaddleStichBinding.instance;
    };
}

class Coating {
    public isCoatable(paper: Product.Paper): boolean {
        if (!paper.isSmooth) return false;  // 不能太粗糙，紙和膜之間會有空隙
        if (paper.thickness < 150 || paper.thickness > 500) return false; // TODO: remove magic number and add comments
        return true;
    }
}