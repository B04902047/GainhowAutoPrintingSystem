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

export abstract class Frame {
    protected widthWithBleeding: number; //還沒初始化
    protected heightWithBleeding: number; //還沒初始化
    protected foldLines: Array<Line>; //有可能是0條，但不會是undefined
    protected cutLines: Array<Line>; //有可能是0條，但不會是undefined
    constructor() {
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


class StandardRectangleFrame extends Frame {
    protected createFoldLines(): Line[] {
        return [];
    }
    protected createCutLines(): Line[] {
        throw new Error("Method not implemented.");
    }

    constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly margin: number,
        public readonly padding: number
    ) {
        super();
    }
}

abstract class BookCoverFrame extends Frame {
    constructor() {
        super();
    }

}
abstract class BookFrameDictionary extends FrameDictionary {
    protected coverFrame: BookCoverFrame;
    protected innerPageFrames: { [pageIndex: string]: StandardRectangleFrame };
    
    constructor(product: Product.Book)   {
        super(product);
        this.coverFrame = this.createBookCoverFrame();
        let innerFrame = this.createInnerPageFramePrototype();
        this.innerPageFrames = {};
        for(let i=1; i<=product.numberOfPages; i++) {
            this.innerPageFrames[i] = innerFrame;
        }
    }
    protected createFrames(): { [frameIndex: string]: Frame } {
        let frames: { [frameIndex: string]: Frame };
        frames['cover'] = this.coverFrame;
        frames = Object.assign(frames, this.innerPageFrames);
        return frames;
    }

    protected abstract createBookCoverFrame(): BookCoverFrame;
    protected abstract createInnerPageFramePrototype(): StandardRectangleFrame;
}

class SaddleStichBindindBookCoverFrame extends BookCoverFrame {
    constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly margin: number,
        public readonly padding: number
    ) {
        super();
    }
    protected createFoldLines(): Line[] {
        let middle = this.width/2;
        let foldLines: Line[] = [];
        let foldLine: Line = new Line(
            middle, 0,
            middle, this.height
        )
        foldLines.push(foldLine);
        return foldLines;
    }
    protected createCutLines(): Line[] {
        throw new Error("Method not implemented.");
    }
    
}
export class SingleSheetFrameDictionary extends FrameDictionary {
    constructor(
        product: Product.SingleSheet 
        ) {
            super(product);
    }
    private static readonly STANDARD_MARGIN = 2;
    private static readonly STANDARD_PADDING = 2;
    protected createFrames(): { [frameIndex: string]: Frame; } {
        let singleSheet: Product.SingleSheet = this.product as Product.SingleSheet;
        let frame = new StandardRectangleFrame (
            singleSheet.width,
            singleSheet.height,
            SingleSheetFrameDictionary.STANDARD_MARGIN,
            SingleSheetFrameDictionary.STANDARD_PADDING
        );
        return {
            "正面": frame,
            "背面": (singleSheet.getIsDoubleSided()) ? frame : undefined
        };
    }
    

}
export class SaddleStichBindindBookFrameDictionary extends BookFrameDictionary {
    private static readonly INNER_PAGE_MARGIN = 3;
    private static readonly INNER_PAGE_PADDING = 3;
    private static readonly COVER_MARGIN = 3;
    private static readonly COVER_PADDING = 3;
    //TODO: 計算、定義騎馬釘書的內頁出血、安全距離
    constructor(product: Product.SaddleStichBindingBook) {
        super(product);       
    }
    protected createBookCoverFrame(): SaddleStichBindindBookCoverFrame {
        let product: Product.SaddleStichBindingBook = this.product as Product.SaddleStichBindingBook;
        return new SaddleStichBindindBookCoverFrame(
            product.coverWidth,
            product.coverHieght,
            SaddleStichBindindBookFrameDictionary.COVER_MARGIN,
            SaddleStichBindindBookFrameDictionary.COVER_PADDING
        );
    }
    protected createInnerPageFramePrototype(): StandardRectangleFrame {
        let product: Product.SaddleStichBindingBook = this.product as Product.SaddleStichBindingBook;
        return new StandardRectangleFrame(
            product.coverWidth,
            product.coverHieght,
            SaddleStichBindindBookFrameDictionary.INNER_PAGE_MARGIN,
            SaddleStichBindindBookFrameDictionary.INNER_PAGE_PADDING
        );
    }
}
class ButterflyBindingBookFrameDictionary extends BookFrameDictionary {
}
class PerfectBindingBookFrameDictionary extends BookFrameDictionary {
}

export class ReviewRegistrationInfo {
}