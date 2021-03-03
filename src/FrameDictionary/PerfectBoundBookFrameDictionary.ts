import PerfectBoundBook from "../Product/PerfectBoundBook";
import BleededRectangleFrame from "../Frame/BleededRectangleFrame";
import BookCoverFrame from "../Frame/BookCoverFrame";
import BookFrameDictionary from "./BookFrameDictionary";
import Line from "../Frame/Line";
import PerfectBoundBookSoftCoverFrame from "../Frame/PerfectBoundBookSoftCoverFrame";
import PerfectBoundBookHardCoverFrame from "../Frame/PerfectBoundHardCoverFrame";

export default class PerfectBoundBookFrameDictionary extends BookFrameDictionary {
    private static readonly INNER_PAGE_CUT_ERROR = 3;
    private static readonly COVER_CUT_ERROR = 3;
    private static readonly BOUND_SIDE_SAFE_DISTANCE: number = 5;
    constructor(
        readonly product: PerfectBoundBook
    ) {
        super(product);       
    }
    protected createInnerPageFrames(): Map<string, BleededRectangleFrame> {
        let innerPageFrames = new Map<string, BleededRectangleFrame>();
        if (this.product.pagingDirection === "BOTTOM_TO_TOP") {
            let pageFramePrototype = this.createBottomToTopPagedPageFramePrototype();
            for (let i=1; i<=this.product.numberOfPages; i++) {
                innerPageFrames.set(String(i), pageFramePrototype);
            }
            return innerPageFrames;
        } else {
            let leftPageFramePrototype: BleededRectangleFrame = this.createLeftInnerPageFramePrototype();
            let rightPageFramePrototype: BleededRectangleFrame = this.createRightInnerPageFramePrototype();
            switch (this.product.pagingDirection) {
                case "LEFT_TO_RIGHT":
                    for (let i=1; i<=this.product.numberOfPages; i++) {
                        if ((i % 2 === 1)) {
                            innerPageFrames.set(String(i), leftPageFramePrototype);
                        } else {
                            innerPageFrames.set(String(i), rightPageFramePrototype);
                        }
                    }
                    return innerPageFrames;
                case "RIGHT_TO_LEFT":
                    for (let i=1; i<=this.product.numberOfPages; i++) {
                        if ((i % 2 === 1)) {
                            innerPageFrames.set(String(i), rightPageFramePrototype);
                        } else {
                            innerPageFrames.set(String(i), leftPageFramePrototype);
                        }
                    }
                    return innerPageFrames;
            }
        }   
    }
    protected createLeftInnerPageFramePrototype(): BleededRectangleFrame {
        class PerfectBoundLeftInnerPageFrame extends BleededRectangleFrame {
            protected createSafeAreaLines(): Line[] {
                let left: number = this.cutError * 2;
                let right: number = this.maxWidth - this.cutError - PerfectBoundBookFrameDictionary.BOUND_SIDE_SAFE_DISTANCE;
                let top: number = this.cutError * 2;
                let bottom: number = this.maxHeight - this.cutError * 2;
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
        }
        return new PerfectBoundLeftInnerPageFrame(
            this.product.width,
            this.product.height,
            PerfectBoundBookFrameDictionary.INNER_PAGE_CUT_ERROR
        );
    }
    protected createRightInnerPageFramePrototype(): BleededRectangleFrame {
        class PerfectBoundRightInnerPageFrame extends BleededRectangleFrame {
            protected createSafeAreaLines(): Line[] {
                let left: number = this.cutError + PerfectBoundBookFrameDictionary.BOUND_SIDE_SAFE_DISTANCE;
                let right: number = this.maxWidth - this.cutError * 2;
                let top: number = this.cutError * 2;
                let bottom: number = this.maxHeight - this.cutError * 2;
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
        }
        return new PerfectBoundRightInnerPageFrame(
            this.product.width,
            this.product.height,
            PerfectBoundBookFrameDictionary.INNER_PAGE_CUT_ERROR
        );
    }
    protected createBottomToTopPagedPageFramePrototype(): BleededRectangleFrame {
        class PerfectBoundBottomToTopPagedPageFrame extends BleededRectangleFrame {
            protected createSafeAreaLines(): Line[] {
                let left: number = this.cutError * 2;
                let right: number = this.maxWidth - this.cutError * 2;
                let top: number = this.cutError + PerfectBoundBookFrameDictionary.BOUND_SIDE_SAFE_DISTANCE;
                let bottom: number = this.maxHeight - this.cutError * 2;
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
        }
        return new PerfectBoundBottomToTopPagedPageFrame(
            this.product.width,
            this.product.height,
            PerfectBoundBookFrameDictionary.INNER_PAGE_CUT_ERROR
        );
    }
    protected createBookCoverFrame(): BookCoverFrame {
        let bookWidth: number = this.product.width;         // 書寬
        let bookHeight: number = this.product.height;       // 書高
        let spineWidth: number = this.product.spineWidth;   // 書背寬
        if (this.product.hardCovered) {
            let outerHingeWidth: number                     // 書溝寬
                = (spineWidth > 25)? 14 : 10;
            return new PerfectBoundBookHardCoverFrame(
                bookWidth,
                bookHeight,
                spineWidth,
                outerHingeWidth,
                PerfectBoundBookFrameDictionary.COVER_CUT_ERROR
            );
        }
        return new PerfectBoundBookSoftCoverFrame(
            bookWidth,
            bookHeight,
            spineWidth,
            PerfectBoundBookFrameDictionary.COVER_CUT_ERROR
        );
    }
}