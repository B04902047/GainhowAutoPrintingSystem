import * as Product from './Product';

export interface Production {
    isProducible(): boolean;
}

abstract class BookProduction implements Production{
    constructor(
        protected readonly product: Product.Book
    ) {
        
    }
    isProducible(): boolean {  //不知道要不要在這裡，或是往下傳
        throw new Error('Method not implemented.');
    }
    protected abstract innerPageShouldCoat(): boolean;
    protected abstract coverShouldCoat(): boolean;

    protected validPaperTextureForInnerPages: Array<Product.PaperTexture>;  //不要lazy innt? => 使用者拉開下拉選單的時候會等待一下才有東西，使用體驗不好? 但是先init的話，不知道要取得的時候，資料已經回來了沒有
    protected validPaperTextureForCover: Array<Product.PaperTexture>;
    

    // 待討論
    public async getValidPaperTexturesForInnerPages(): Promise<Array<Product.PaperTexture>> {
        if (!this.validPaperTextureForInnerPages) await this.createAndSetValidPaperTextureForInnerPages();
        return Promise.resolve(this.validPaperTextureForInnerPages);
    }
    public async getValidPaperTexturesForCover(): Promise<Array<Product.PaperTexture>> {
        if (!this.validPaperTextureForCover) await this.createAndSetValidPaperTextureForCover();
        return Promise.resolve(this.validPaperTextureForCover);
    }


    
    protected async createAndSetValidPaperTextureForInnerPages(): Promise<void> {
        this.validPaperTextureForInnerPages = await this.loadValidPaperTextureForInnerPages();
    }
    protected async createAndSetValidPaperTextureForCover(): Promise<void> {
        this.validPaperTextureForCover = await this.loadValidPaperTextureForCover();
    }
    protected abstract loadValidPaperTextureForInnerPages(): Promise<Array<Product.PaperTexture>>;
    protected abstract loadValidPaperTextureForCover(): Promise<Array<Product.PaperTexture>>;

}

export class SaddleStichBingingBookProduction extends BookProduction{
    protected innerPageShouldCoat(): boolean {
        throw new Error('Method not implemented.');
    }
    protected coverShouldCoat(): boolean {
        throw new Error('Method not implemented.');
    }
    protected loadValidPaperTextureForInnerPages(): Promise<Product.PaperTexture[]> {
        throw new Error('Method not implemented.');
    }
    protected loadValidPaperTextureForCover(): Promise<Product.PaperTexture[]> {
        throw new Error('Method not implemented.');
    }
}

//要想要怎麼設計一個Requestor 去要各類別所有可用的紙質