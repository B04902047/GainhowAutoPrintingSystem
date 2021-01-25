import * as Product from './Product';

export interface Production {
    isProducible(): boolean;
}

export class SingleSheetProduction implements Production {
    isProducible(): boolean {
        throw new Error('Method not implemented.');
    }
}

class BookProductionOptions {
    constructor(
        readonly validPaperTextureForInnerPages: Array<Product.Paper>,
        readonly validPaperTextureForCover: Array<Product.Paper>
    ) {}
}

abstract class SingletonBookProductionOptionsRequestor {
    /**
     * @abstract
     * must be overriden within concrete book production options requestors,
     * otherwise there won't be any instances
     */
    protected static instance: SingletonBookProductionOptionsRequestor;
    public static getInstance() { return this.instance; }

    protected bookProductionOptions?: BookProductionOptions;
    public async loadBookProductionOptions(): Promise<BookProductionOptions> {
        if (!this.bookProductionOptions) return await this.requestAndSetBookProductionOptions();
        return this.bookProductionOptions;
    }
    public async requestAndSetBookProductionOptions(): Promise<BookProductionOptions> {
        this.bookProductionOptions = await this.requestBookProductionOptions();
        return this.bookProductionOptions;
    }
    protected async requestBookProductionOptions(): Promise<BookProductionOptions> {
        let validPaperTextureForInnerPages: Array<Product.Paper>
            = await this.requestValidPaperTexturesForInnerPages();
        let validPaperTextureForCover: Array<Product.Paper>
            = await this.requestValidPaperTexturesForCover();
        return new BookProductionOptions(
            validPaperTextureForInnerPages,
            validPaperTextureForCover
        )
    }
    protected abstract requestValidPaperTexturesForInnerPages(): Promise<Array<Product.Paper>>;
    protected abstract requestValidPaperTexturesForCover(): Promise<Array<Product.Paper>>;
}

export abstract class BookProduction implements Production {
    abstract readonly bindingStyle: BookBindingStyle;
    /**
     * @abstract
     * must be overriden within concrete book productions,
     * otherwise there won't be any options
     */
    protected static options: Promise<BookProductionOptions>
        = Promise.resolve(new BookProductionOptions([], []));
    constructor(
        protected readonly product: Product.Book
    ) {}
    isProducible(): boolean {  //不知道要不要在這裡，或是往下傳
        throw new Error('Method not implemented.');
    }

    public abstract estimateSpineWidth(): number;
    protected abstract innerPageShouldCoat(): boolean;
    protected abstract coverShouldCoat(): boolean;
}

class SingletonSaddleStichBindingBookProductionOptionsRequestor extends SingletonBookProductionOptionsRequestor {
    protected instance = new SingletonSaddleStichBindingBookProductionOptionsRequestor();
    private constructor() {
        super()
    }
    protected requestValidPaperTexturesForInnerPages(): Promise<Product.Paper[]> {
        throw new Error('Method not implemented.');
    }
    protected requestValidPaperTexturesForCover(): Promise<Product.Paper[]> {
        throw new Error('Method not implemented.');
    }
}

export class SaddleStichBindingBookProduction extends BookProduction {
    readonly bindingStyle: SaddleStichBinding = SaddleStichBinding.getInstance();
    public estimateSpineWidth(): number { return 0; }
    protected innerPageShouldCoat(): boolean { return false; }
    protected coverShouldCoat(): boolean { return true; }
    protected static options: Promise<BookProductionOptions>
        = SingletonSaddleStichBindingBookProductionOptionsRequestor.getInstance().loadBookProductionOptions();
}

export abstract class BookBindingStyle {
    // TODO:? 厚度會不會影響內頁？會的話要新增「厚度」參數
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