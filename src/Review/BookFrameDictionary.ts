import { Book } from "../Product/Book";
import { BleededRectangleFrame } from "./BleededRectangleFrame";
import { BookCoverFrame } from "./BookCoverFrame";
import { FrameDictionary } from "./FrameDictionary";
import { RectangleFrame } from "./RectangleFrame";

export abstract class BookFrameDictionary extends FrameDictionary {
    protected coverFrame: BookCoverFrame;
    protected innerPageFrames: Map<string, RectangleFrame>;
    
    constructor(product: Book)   {
        super(product);
        this.coverFrame = this.createBookCoverFrame();
        this.innerPageFrames = this.createInnerPageFrames();
    }
    protected createFrames(): Map<string, RectangleFrame> {
        let frames = new Map<string, RectangleFrame>();
        frames.set('cover', this.coverFrame);
        frames = Object.assign(frames, this.innerPageFrames);
        return frames;
    }
    protected abstract createInnerPageFrames(): Map<string, RectangleFrame>;
    protected abstract createBookCoverFrame(): BookCoverFrame;
}