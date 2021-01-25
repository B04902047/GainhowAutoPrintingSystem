import * as Product from "./Product"
import { Exclude, Expose, plainToClass, Transform, Type } from 'class-transformer';
import { FramedPageInterface, ReviewingProgress, ReviewItemInterface, ReviewModelInterface, ReviewStatusInterface, UploadFileProcessingStage, UploadFileStatusInterface } from "./Interfaces";


export abstract class FrameDictionary {
    private frames: Map<string, Frame>;
    constructor(
        readonly product: Product.Product  
        ) {
            this.frames = this.createFrames();
    }
    public get frameIndices(): Array<string> {
        return Object.keys(this.frames);
    }
    public getFrame(frameIndex: string): Frame | undefined {
        return this.frames.get(frameIndex);
    }
    
    protected abstract createFrames(): Map<string, Frame>;
}

export abstract class Frame {
    public readonly foldLines: Array<Line>;   // 有可能是0條，但不會是undefined
    public readonly cutLines: Array<Line>;    // 有可能是0條，但不會是undefined
    constructor(
        protected maxWidth: number,
        protected maxHeight: number
    ) {
        //super(width,height);
        this.foldLines = this.createFoldLines();
        this.cutLines = this.createCutLines();
    }

    protected abstract createFoldLines(): Array<Line>;
    protected abstract createCutLines(): Array<Line>;
}

export class Line {
    constructor(
        readonly startX: number,
        readonly startY: number,
        readonly endX: number,
        readonly endY: number,
    ) {}
}

export abstract class RectangleFrame extends Frame {
    constructor(
        protected width: number,
        protected height: number
    ) {
        super(width, height);
    }
}

class BleededRectangleFrame extends RectangleFrame {
    protected createFoldLines(): Line[] {
        return [];
    }
    protected createCutLines(): Line[] {
        let leftCutLine: Line = new Line(
            this.cutError, 0,
            this.cutError, this.maxHeight
        );
        let rightCutLine: Line = new Line(
            this.maxWidth - this.cutError, 0,
            this.maxWidth - this.cutError, this.maxHeight
        );
        let topCutLine: Line = new Line(
            0, this.cutError,
            this.maxWidth, this.cutError
        );
        let bottomCutLine: Line = new Line(
            0, this.maxHeight - this.cutError,
            this.maxWidth, this.maxHeight - this.cutError
        );
        return [
            leftCutLine,
            rightCutLine,
            topCutLine,
            bottomCutLine
        ];
    }

    constructor(
        public readonly widthWithoutBleeding: number,
        public readonly heightWithoutBleeding: number,
        public readonly cutError: number,
    ) {
        super(
            widthWithoutBleeding + (2 * cutError),
            heightWithoutBleeding + (2 * cutError)
        );
    }
}

abstract class BookCoverFrame extends BleededRectangleFrame {
    constructor(
        widthWithoutBleeding: number,
        heightWithoutBleeding: number,
        cutError: number
    ) {
        super(
            widthWithoutBleeding,
            heightWithoutBleeding,
            cutError,
        );
    }
    protected abstract createFoldLines(): Line[];
}

abstract class BookFrameDictionary extends FrameDictionary {
    protected coverFrame: BookCoverFrame;
    protected innerPageFrames: Map<string, RectangleFrame>;
    
    constructor(product: Product.Book)   {
        super(product);
        this.coverFrame = this.createBookCoverFrame();
        let innerFramePrototype: BleededRectangleFrame = this.createInnerPageFramePrototype();
        this.innerPageFrames =new Map<string, RectangleFrame>();;
        for (let i=1; i<=product.numberOfPages; i++) {
            this.innerPageFrames.set(String(i), innerFramePrototype);
        }
    }
    protected createFrames(): Map<string, RectangleFrame> {
        let frames = new Map<string, RectangleFrame>();
        frames.set('cover', this.coverFrame);
        frames = Object.assign(frames, this.innerPageFrames);
        return frames;
    }

    protected abstract createBookCoverFrame(): BookCoverFrame;
    protected abstract createInnerPageFramePrototype(): BleededRectangleFrame;
}

class SaddleStichBindindBookCoverFrame extends BookCoverFrame {
    protected createFoldLines(): Line[] {
        let middle: number = this.maxWidth / 2;
        let middleLine: Line = new Line(
            middle, 0,
            middle, this.maxHeight
        )
        return [middleLine];
    }
}
export class SingleSheetFrameDictionary extends FrameDictionary {
    constructor(
        readonly product: Product.SingleSheet 
        ) {
        super(product);
    }
    private static readonly CUT_ERROR = 2;
    protected createFrames(): Map<string, RectangleFrame> {
        let frame = new BleededRectangleFrame (
            this.product.width,
            this.product.height,
            SingleSheetFrameDictionary.CUT_ERROR,
        );
        let frames = new Map<string, RectangleFrame>();
        frames.set("frontSide", frame);
        if (this.product.isDoubleSided) {
            frames.set("backSide", frame);
        }
        return frames;
    }
}

export class SaddleStichBindindBookFrameDictionary extends BookFrameDictionary {
    private static readonly INNER_PAGE_CUT_ERROR = 3;
    private static readonly COVER_CUT_ERROR = 3;
    constructor(
        readonly product: Product.SaddleStichBindingBook
    ) {
        super(product);       
    }
    protected createBookCoverFrame(): SaddleStichBindindBookCoverFrame {
        return new SaddleStichBindindBookCoverFrame(
            this.product.coverWidth,
            this.product.coverHeight,
            SaddleStichBindindBookFrameDictionary.COVER_CUT_ERROR
        );
    }
    protected createInnerPageFramePrototype(): BleededRectangleFrame {
        return new BleededRectangleFrame(
            this.product.coverWidth,
            this.product.coverHeight,
            SaddleStichBindindBookFrameDictionary.INNER_PAGE_CUT_ERROR
        );
    }
}
class ButterflyBindingBookFrameDictionary extends BookFrameDictionary {
    protected createBookCoverFrame(): BookCoverFrame {
        throw new Error("Method not implemented.");
    }
    protected createInnerPageFramePrototype(): BleededRectangleFrame {
        throw new Error("Method not implemented.");
    }
}
class PerfectBindingBookFrameDictionary extends BookFrameDictionary {
    protected createBookCoverFrame(): BookCoverFrame {
        throw new Error("Method not implemented.");
    }
    protected createInnerPageFramePrototype(): BleededRectangleFrame {
        throw new Error("Method not implemented.");
    }
}

export class ReviewRegistrationInfo {
}


export class ReviewItem implements ReviewItemInterface {
    
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

export class ReviewModel implements ReviewModelInterface {

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

export class ReviewStatus implements ReviewStatusInterface {

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

export class FramedPage implements FramedPageInterface {   
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

export class UploadFileStatus implements UploadFileStatusInterface {

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
