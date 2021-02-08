import * as Product from "./Product"
import { Exclude, Expose, plainToClass, Transform, Type } from 'class-transformer';
import { FramedPage, ReviewingProgress, ReviewItem, ReviewModel, ReviewRegistrationInfo, ReviewStatus, UploadFileProcessingStage, UploadFileStatus } from "./Interface";





















export class ReviewRegistrationInfo implements ReviewRegistrationInfo{
    constructor (
        public readonly numberOfModels: number,
        public readonly product: Product.Product,
    ) {

    }
    
}


export class ReviewItem implements ReviewItem {
    
    @Exclude()
    protected _models: Map<number, ReviewModel> = new Map();

    @Type(() => ReviewStatus)
    public readonly status: ReviewStatus;

    @Type(() => Product.Product, {
        discriminator: Product.PRODUCT_TYPE_DISCRIMINATOR
    })
    public readonly product: Product.Product;
    
    constructor(
        public readonly reviewId: string,
        public readonly numberOfModels: number,
        status: ReviewStatus,
        product: Product.Product, 
    ) {
        this.status = status;
        this.product = product;
        this.createAndSetBlankModels();
    }

    public set models(models: Map<number, ReviewModel>) {
        if (models.size !== this.numberOfModels) {
            throw new Error(`number of models inconsistent: should be ${this.numberOfModels}, but has ${models.size}`);
        }
        this._models = models;
    }

    @Expose()
    @Type(() => ReviewModel)
    public get models(): Map<number, ReviewModel> {
        if (this._models.size !== this.numberOfModels) return this.createAndSetBlankModels();
        return this._models;
    }

    protected createAndSetBlankModels(): Map<number, ReviewModel> {
        this.models = this.createBlankModels();
        return this.models;
    }
    protected createBlankModels(): Map<number, ReviewModel> {
        let models = new Map<number, ReviewModel>();
        for (let modelIndex: number = 1; modelIndex <= this.numberOfModels; modelIndex++) {
            models.set(
                modelIndex,
                new ReviewModel(modelIndex, this)
            );
        }
        return models;
    }

    public get frameDictionary(): FrameDictionary {
        return this.product.frameDictionary;
    }
}

export class ReviewModel implements ReviewModel {

    @Exclude()
    protected _framedPages: Map<string, FramedPage> = new Map();

    @Exclude()
    protected _frameDictionary?: FrameDictionary;

    @Exclude()
    public reviewItem: ReviewItem;

    constructor(
        public readonly modelIndexInReviewItem: number,
        reviewItem: ReviewItem
    ) {
        this.reviewItem = reviewItem;
        this.createAndSetBlankFramedPages();
    }

    public getFrame(index: string): Frame | undefined {
        return this.frameDictionary.getFrame(index);
    }

    @Expose()
    @Type(() => FramedPage)
    public get framedPages(): Map<string, FramedPage> {
        if (this._framedPages.size !== this.numberOfFramedPages) return this.createAndSetBlankFramedPages();
        return this._framedPages;
    }

    @Expose({toPlainOnly: true})
    public get numberOfFramedPages(): number {
        return this.frameIndices.length;
    }
    public set framedPages(framedPages: Map<string, FramedPage>) {
        if (framedPages.size !== this.numberOfFramedPages) throw new Error("map size inconsistent");
        this._framedPages = framedPages;
    }
    protected createAndSetBlankFramedPages(): Map<string, FramedPage> {
        this.framedPages = this.createBlankFramedPages();
        return this.framedPages;
    }

    protected createBlankFramedPages(): Map<string, FramedPage> {
        let framedPages = new Map();
        let frameIndices = this.frameIndices;
        for (const frameIndex of frameIndices) {
            framedPages.set(
                frameIndex,
                new FramedPage(
                    frameIndex,
                    this
                )
            )
        }
        return framedPages;
    }
    protected get frameIndices(): Array<string> {
        return this.frameDictionary.frameIndices;
    }
    protected get frameDictionary(): FrameDictionary {
        if (!this._frameDictionary) return this.getAndSetFrameDictionary();
        return this._frameDictionary;
    }
    protected getAndSetFrameDictionary(): FrameDictionary {
        this._frameDictionary = this.reviewItem.frameDictionary;
        return this._frameDictionary;
    }
}

export class ReviewStatus implements ReviewStatus {

    @Type(() => UploadFileStatus)
    public uploadFileStatuses: Array<UploadFileStatus>;

    // TODO: enum? string literal? serializable?
    public progress: ReviewingProgress;
    constructor (
        uploadFileStatuses: Array<UploadFileStatus>,
        progress: ReviewingProgress
    ) {
        this.uploadFileStatuses = uploadFileStatuses;
        this.progress = progress;
    }
}

export class FramedPage implements FramedPage {   
    inputPagePreviewAddress?: string;
    printableResultingImageAddress?: string;
    printableResultingFileAddress?: string;

    @Exclude()
    private _rotationDegree: number;

    @Exclude()
    public readonly reviewModel: ReviewModel;

    constructor (
        public readonly pageIndex: string,
        reviewModel: ReviewModel,
        public positionX: number = 0,
        public positionY: number = 0,
        public scaleX: number = 1,
        public scaleY: number = 1,
        _rotationDegree: number = 0
    ) {
        this.reviewModel = reviewModel;
        this._rotationDegree = _rotationDegree;
    }

    public getFrame(): Frame | undefined {
      return this.reviewModel.getFrame(this.pageIndex);
    }

    public reset(): void {
        this.rotate(0);   // 回到原本的角度
        this.moveTo(0, 0);  // 回到原點
        this.scale(1, 1);   // 回到原本的縮放
    }

    // 旋轉
    public rotate(degree: number): void {
        this.rotationDegree = degree;
    }

    @Expose()
    public get rotationDegree(): number {
        return this._rotationDegree;
    }
    public set rotationDegree(degree: number) {
        this._rotationDegree = degree % 360;
    }
    // 縮放
    public scale(x: number, y: number): void {
        if(x > 0 && y > 0) {
            this.setScale(x, y);
        }
        else {
            //TODO: 錯誤? 就默默不讓他做? 提醒? 還是0沒有關係?
        }
    }

    private setScale(x: number, y:number) {
        this.scaleX = x;
        this.scaleY = y;
    }

    // 移動位置
    public moveTo(x: number, y: number): void {
        // 檢查是否超出去，最多就是剛好超出去?防呆要在這裡嗎? 還是說寫前端的時候再防就好了
        this.setPosition(x,y);
    }

    private setPosition(x: number, y: number) {
        this.positionX = x;
        this.positionY = y;
    }
    // 需要的method : setFile  getPreviewImage getResultImage getResultFlie
    // cleanFile? 空白頁? 選擇了頁是不是可以改選擇用空白頁 
}

export class UploadFileStatus implements UploadFileStatus {

    constructor (
        readonly fileName: string,
        public currentStage: UploadFileProcessingStage,
        public numberOfPages?: number,
        public fileAddress?: string,
        public previewPagesAddress?: Array<string>,
        public printablePagesAddress?: Array<string>,
        public errorStage?: UploadFileProcessingStage
    ) {}

    @Expose()
    public get hasError(): boolean {
        if (this.errorStage) return true;
        return false;
    }
}
