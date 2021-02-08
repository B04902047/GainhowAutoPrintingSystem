import BookCoverFrame from "./BookCoverFrame";
import Line from "./Line";

export default class PerfectBoundBookSoftCoverFrame extends BookCoverFrame {
    constructor(
        readonly bookWidth: number,
        readonly bookHeight: number,
        readonly bookSpineWidth: number,
        readonly cutError: number
    ) {
        super(
            bookWidth * 2 + bookSpineWidth,
            bookHeight,
            cutError
        );
    }
    protected createFoldLines(): Line[] {
        let leftFoldLine: Line = new Line(
            this.cutError + this.bookWidth, 0,
            this.cutError + this.bookWidth, this.height
        );
        let rightFoldLine: Line = new Line(
            this.width - this.cutError - this.bookWidth, 0,
            this.width - this.cutError - this.bookWidth, this.height
        );
        return [
            leftFoldLine,
            rightFoldLine
        ];
    }
}