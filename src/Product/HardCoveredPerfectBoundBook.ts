import { BookPagingDirection } from "../Interface";
import { Coat } from "../Material/Coat";
import { Paper } from "../Material/Paper";
import { PerfectBoundBook } from "./PerfectBoundBook";

export class HardCoveredPerfectBoundBook extends PerfectBoundBook {
    constructor(
        public width: number,
        public height: number,
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
            width,
            height,
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