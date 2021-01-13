export abstract class FrameDictionary {
    public abstract getFrameIndices(): Array<string>;
    public abstract getFrame(frameIndex: string): Frame;
}

export interface Frame {
    
}