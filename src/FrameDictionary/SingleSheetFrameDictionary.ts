import SingleSheet from "../Product/SingleSheet";
import BleededRectangleFrame from "../Frame/BleededRectangleFrame";
import FrameDictionary from "./FrameDictionary";
import RectangleFrame from "../Frame/RectangleFrame";

export default class SingleSheetFrameDictionary extends FrameDictionary {
    constructor(
        readonly product: SingleSheet 
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