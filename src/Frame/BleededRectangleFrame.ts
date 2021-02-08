import Line from "./Line";
import RectangleFrame from "./RectangleFrame";

export default class BleededRectangleFrame extends RectangleFrame {
    protected createSafeAreaLines(): Line[] {
        let twiceCutError: number = this.cutError * 2;
        let left: number = twiceCutError;
        let right: number = this.maxWidth - twiceCutError;
        let top: number = twiceCutError;
        let bottom: number = this.maxHeight - twiceCutError;
        let leftSafeAreaLine: Line = new Line(
            left, top,
            left, bottom
        );
        let rightSafeAreaLine: Line = new Line(
            right, top,
            right, bottom
        );
        let topSafeAreaLine: Line = new Line(
            left, top,
            right, top
        );
        let bottomSafeAreaLine: Line = new Line(
            left, bottom,
            right, bottom
        );
        return [
            leftSafeAreaLine,
            rightSafeAreaLine,
            topSafeAreaLine,
            bottomSafeAreaLine
        ];
    }
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
        public readonly widthWithoutBleeding: number,   // 裁切後的寬（mm）
        public readonly heightWithoutBleeding: number,  // 裁切後的高（mm）
        public readonly cutError: number,               // 裁切誤差／出血範圍（mm）
    ) {
        super(
            widthWithoutBleeding + (2 * cutError),
            heightWithoutBleeding + (2 * cutError)
        );
    }
}