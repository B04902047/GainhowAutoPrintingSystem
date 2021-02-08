import BookCoverFrame from "./BookCoverFrame";
import Line from "./Line";

export default class SaddleStitchedBookCoverFrame extends BookCoverFrame {
    constructor(
        bookWidth: number,
        bookHeight: number,
        cutError: number,
    ) {
        super(
            bookWidth * 2,
            bookHeight,
            cutError
        );
    }
    protected createFoldLines(): Line[] {
        let middle: number = this.maxWidth / 2;
        let middleLine: Line = new Line(
            middle, 0,
            middle, this.maxHeight
        )
        return [middleLine];
    }
}