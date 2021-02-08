
import BookCoverFrame from "./BookCoverFrame";
import Line from "./Line";

export default class PerfectBoundBookHardCoverFrame extends BookCoverFrame {
    constructor(
        readonly bookWidth: number,         // 書的寬度（mm）
        readonly bookHeight: number,        // 書的高度（mm）
        readonly bookSpineWidth: number,    // 書背寬度（mm）
        readonly outerHingeWidth: number,   // 書溝寬度（mm）
        readonly cutError: number           // 出血範圍（mm）
    ) {
        super(
            (bookWidth + outerHingeWidth) * 2 + bookSpineWidth,
            bookHeight,
            cutError
        );
    }
    protected createFoldLines(): Line[] {
        let leftHingeLeftFoldLine: Line = new Line(
            this.cutError + this.bookWidth, 0,
            this.cutError + this.bookWidth, this.bookHeight
        );
        let leftHingeRightFoldLine: Line = new Line(
            this.cutError + this.bookWidth + this.outerHingeWidth, 0,
            this.cutError + this.bookWidth + this.outerHingeWidth, this.bookHeight
        );
        let rightHingeLeftFoldLine: Line = new Line(
            this.width - this.cutError - this.bookWidth - this.outerHingeWidth, 0,
            this.width - this.cutError - this.bookWidth - this.outerHingeWidth, this.bookHeight
        );
        let rightHingeRightFoldLine: Line = new Line(
            this.width - this.cutError - this.bookWidth, 0,
            this.width - this.cutError - this.bookWidth, this.bookHeight
        );
        return [
            leftHingeLeftFoldLine,
            leftHingeRightFoldLine,
            rightHingeLeftFoldLine,
            rightHingeRightFoldLine
        ];
    }
}