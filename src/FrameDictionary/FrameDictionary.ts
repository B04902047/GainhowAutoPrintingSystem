import Product from "../Product/Product";
import Frame from "../Frame/Frame";

export default abstract class FrameDictionary {
    private frames: Map<string, Frame>;
    constructor(
        readonly product: Product  
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