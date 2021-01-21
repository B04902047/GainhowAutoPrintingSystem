import * as Product from "./Product"

export abstract class FrameDictionary {
    private frames: Map<string, Frame>;
    constructor(
        readonly product: Product.Product  
        ) {
            this.frames = this.createFrames();
    }
    public getFrameIndices(): Array<string> {
        return Object.keys(this.frames);
    }
    public getFrame(frameIndex: string): Frame | undefined {
        return this.frames.get(frameIndex);
    }
    
    protected abstract createFrames(): Map<string, Frame>;
}

abstract class Frame {
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


class Line {
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
        if (this.product.getIsDoubleSided()) {
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

}
class PerfectBindingBookFrameDictionary extends BookFrameDictionary {
}

export class ReviewRegistrationInfo {
}


export class ReviewItem {
    protected models: Map<number, ReviewModel> = new Map();
    constructor(
        public readonly reviewId: string,
        public readonly numberOfModels: number,
        public readonly status: ReviewStatus,
        public readonly product: Product.Product, 
    ) {}

    public setModels(models: Map<number, ReviewModel>): boolean {
        if (models.size !== this.numberOfModels) return false;
        this.models = models;
        return true;
    }
    public getModels(): Map<number, ReviewModel> {
        if (this.models.size !== this.numberOfModels) return this.createAndSetNewModels();
        return this.models;
    }

    public createAndSetNewModels(): Map<number, ReviewModel> {
        this.models = new Map<number, ReviewModel>();
        for (let modelIndex: number = 1; modelIndex <= this.numberOfModels; modelIndex++) {
            this.models.set(
                modelIndex,
                new ReviewModel(modelIndex, this)
            );
        }
        return this.models;
    }

    public getFrameDictionary(): FrameDictionary {
        return this.product.getFrameDictionary();
    }
}

export class ReviewModel {
    protected framedPages: Map<string, FramedPage> = new Map();
    protected frameDictionary?: FrameDictionary;
    constructor(
        public readonly modelIndexInReviewItem: number,
        public readonly reviewItem: ReviewItem
    ) {}
    public getFrame(index: string): Frame | undefined {
        return this.getFrameDictionary().getFrame(index);
    }
    public getFramedPages(): Map<string, FramedPage> {
        if (this.framedPages.size !== this.getNumberOfFramedPages()) return this.createAndSetNewFramedPages();
        return this.framedPages;
    }
    public getNumberOfFramedPages(): number {
        return this.getFrameIndices().length;
    }
    public setFramedPages(framedPages: Map<string, FramedPage>): boolean {
        if (framedPages.size !== this.getNumberOfFramedPages()) return false;
        this.framedPages = framedPages;
        return true;
    }
    public createAndSetNewFramedPages(): Map<string, FramedPage> {
        this.framedPages = new Map();
        let frameIndices = this.getFrameIndices();
        for (const frameIndex of frameIndices) {
            this.framedPages.set(
                frameIndex,
                new FramedPage(
                    frameIndex,
                    this
                )
            )
        }
        return this.framedPages;
    }
    public getFrameIndices(): Array<string> {
        return this.getFrameDictionary().getFrameIndices();
    }
    public getFrameDictionary(): FrameDictionary {
        if (!this.frameDictionary) return this.getAndSetFrameDictionary();
        return this.frameDictionary;
    }
    protected getAndSetFrameDictionary(): FrameDictionary {
        this.frameDictionary = this.reviewItem.getFrameDictionary();
        return this.frameDictionary;
    }
}

export class ReviewStatus {
    constructor (
        protected uploadFileStatuses: Array<UploadFileStatus>,
        protected progress: ReviewingProgress
    ) {
        
    }
}

export class FramedPage {   
    inputPagePreviewAddress: string;
    printableResultingImageAddress?: string;
    printableResultingFileAddress?: string;

    constructor (
        public readonly pageIndex: string,
        public readonly reviewModel: ReviewModel,  
        protected positionX: number = 0,
        protected positionY: number = 0,
        protected scaleX: number = 1,
        protected scaleY: number = 1,
        protected rotationDegree: number = 0
    ) {}

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
        this.setRotationDegree(degree);
    }

    private setRotationDegree(degree: number) {
        this.rotationDegree = degree;
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


export enum ReviewingProgress {
    REGISTERED = '已登記審稿，但還沒開始上傳檔案',
    UPLOADING = '已經開始上傳檔案，但還有檔案沒上傳完畢',
    GENERATING_PREVIEW_PAGES = '所有檔案都上傳完畢，但還有檔案預覽圖在生成中',
    WAITING_PRINTABLE_REVIEW = '預覽圖都生成完畢，但使用者還在確認排版',
    GENERATING_PRINTABLE_REVIEWED_PAGES = '使用者已確認排版，但還有印刷檔在生成中',
    WAITING_FOR_USER_CHECK = '印刷檔都生成完畢，但使用者還沒確認最終結果',
    FINISHED = '使用者審稿完畢'
}

export enum UploadFileProcessingStage {
    UPLOAD = '已登記上傳檔案，但檔案還沒上傳完',
    GENERATING_PREVIEW_PAGES = '已收到上傳檔，但正在生成預覽圖',
    GENERATING_PRINTABLE_PAGES = '已生成預覽圖，但PDF還沒好',
    FINISHED = '處理完畢'
}

export class UploadFileStatus {
    constructor (
        readonly fileName: string,        
        protected currentStage: UploadFileProcessingStage,
        protected numberOfPages?: number,
        protected fileAddress?: string,
        protected previewPagesAddress?: Array<string>,
        protected printablePagesAddress?: Array<string>,
        protected errorStage?: UploadFileProcessingStage
    ) {

    }
    public hasError(): boolean {
        if (this.errorStage) return true;
        return false;
    }
}

