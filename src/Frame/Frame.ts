import Line from "./Line";

export default abstract class Frame {
    public readonly foldLines: Array<Line>;     // 折線：有可能是0條，但不會是undefined
    public readonly cutLines: Array<Line>;      // 裁切線：有可能是0條，但不會是undefined
    public readonly safeAreaLines: Array<Line>; // 安全範圍標示線（不建議放文字的區域）
    constructor(
        protected maxWidth: number,
        protected maxHeight: number
    ) {
        //super(width,height);
        this.foldLines = this.createFoldLines();
        this.cutLines = this.createCutLines();
        this.safeAreaLines = this.createSafeAreaLines();
    }

    protected abstract createFoldLines(): Array<Line>;
    protected abstract createCutLines(): Array<Line>;
    protected abstract createSafeAreaLines(): Array<Line>;
}