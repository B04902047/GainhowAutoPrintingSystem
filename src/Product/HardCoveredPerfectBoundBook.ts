import { BookPagingDirection } from "../Interface";
import { Coat } from "../Material/Coat";
import { Paper } from "../Material/Paper";
import { PerfectBoundBook } from "./PerfectBoundBook";

class HardCoveredPerfectBoundBook extends PerfectBoundBook {
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
        public spineStyle: "standard" | "rounded" = "standard",
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
            true,
            threadSewn,
            spineStyle
        );
    }
}