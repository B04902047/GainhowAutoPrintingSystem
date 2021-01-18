import * as Product from "./Product"


export abstract class FrameDictionary {
    private frames: { [frameIndex: string]: Frame };
    constructor(
        readonly product: Product.Product  
        ) {
            this.frames = this.createFrames();
    }
    public getFrameIndices(): Array<string> {
        return Object.keys(this.frames);
    }
    public getFrame(frameIndex: string): Frame | undefined {
        return this.frames[frameIndex];
    }
    
    protected abstract createFrames(): { [frameIndex: string]: Frame };
}

interface Frame {

}

export abstract class RectangleFrame implements Frame {

    protected foldLines: Array<Line>;   // 有可能是0條，但不會是undefined
    protected cutLines: Array<Line>;    // 有可能是0條，但不會是undefined
    constructor(
        protected width: number,
        protected height: number
    ) {
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


class BleededRectangleFrame extends RectangleFrame {
    protected createFoldLines(): Line[] {
        return [];
    }
    protected createCutLines(): Line[] {
        let leftCutLine: Line = new Line(
            this.cutError, 0,
            this.cutError, this.height
        );
        let rightCutLine: Line = new Line(
            this.width - this.cutError, 0,
            this.width - this.cutError, this.height
        );
        let topCutLine: Line = new Line(
            0, this.cutError,
            this.width, this.cutError
        );
        let bottomCutLine: Line = new Line(
            0, this.height - this.cutError,
            this.width, this.height - this.cutError
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
    protected innerPageFrames: { [pageIndex: string]: BleededRectangleFrame };
    
    constructor(product: Product.Book)   {
        super(product);
        this.coverFrame = this.createBookCoverFrame();
        let innerFramePrototype: BleededRectangleFrame = this.createInnerPageFramePrototype();
        this.innerPageFrames = {};
        for (let i=1; i<=product.numberOfPages; i++) {
            this.innerPageFrames[i] = innerFramePrototype;
        }
    }
    protected createFrames(): { [frameIndex: string]: RectangleFrame } {
        let frames: { [frameIndex: string]: RectangleFrame };
        frames['cover'] = this.coverFrame;
        frames = Object.assign(frames, this.innerPageFrames);
        return frames;
    }

    protected abstract createBookCoverFrame(): BookCoverFrame;
    protected abstract createInnerPageFramePrototype(): BleededRectangleFrame;
}

class SaddleStichBindindBookCoverFrame extends BookCoverFrame {
    protected createFoldLines(): Line[] {
        let middle: number = this.width / 2;
        let middleLine: Line = new Line(
            middle, 0,
            middle, this.height
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
    protected createFrames(): { [frameIndex: string]: RectangleFrame; } {
        let frame = new BleededRectangleFrame (
            this.product.width,
            this.product.height,
            SingleSheetFrameDictionary.CUT_ERROR,
        );
        return {
            "正面": frame,
            "背面": (this.product.getIsDoubleSided()) ? frame : undefined
        };
    }
    

}
export class SaddleStichBindindBookFrameDictionary extends BookFrameDictionary {
    private static readonly INNER_PAGE_CUT_ERROR = 3;
    private static readonly COVER_CUT_ERROR = 3;
    //TODO: 計算、定義騎馬釘書的內頁出血、安全距離
    constructor(
        readonly product: Product.SaddleStichBindingBook
    ) {
        super(product);       
    }
    protected createBookCoverFrame(): SaddleStichBindindBookCoverFrame {
        return new SaddleStichBindindBookCoverFrame(
            this.product.coverWidth,
            this.product.coverHieght,
            SaddleStichBindindBookFrameDictionary.COVER_CUT_ERROR
        );
    }
    protected createInnerPageFramePrototype(): BleededRectangleFrame {
        return new BleededRectangleFrame(
            this.product.coverWidth,
            this.product.coverHieght,
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