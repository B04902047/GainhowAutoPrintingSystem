import { BookPagingDirection } from "../Interface";
import { Coat } from "../Material/Coat";
import { Paper } from "../Material/Paper";
import { PerfectBoundBook } from "./PerfectBoundBook";

class SoftCoveredPerfectBoundBook extends PerfectBoundBook {
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public pagingDirection: BookPagingDirection,
        public coverPaperTexture: Paper,
        public innerPagesPaperTexture: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        public threadSewn: boolean = false,
    ) {
        super(
            coverWidth,
            coverHeight,
            numberOfPages,
            pagingDirection,
            coverPaperTexture,
            innerPagesPaperTexture,
            coverCoating,
            innerPageCoating,
            false,
            threadSewn,
            "standard"
        );
    }
}