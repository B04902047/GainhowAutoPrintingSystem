import { BookPagingDirection } from "../Interface";
import Coat from "../Material/Coat";
import Paper from "../Material/Paper";
import PerfectBoundBook from "./PerfectBoundBook";

export class SoftCoveredPerfectBoundBook extends PerfectBoundBook {
    constructor(
        public width: number,
        public height: number,
        public numberOfPages: number,
        public pagingDirection: BookPagingDirection,
        public coverPaper: Paper,
        public innerPagesPaper: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        public threadSewn: boolean = false,
    ) {
        super(
            width,
            height,
            numberOfPages,
            pagingDirection,
            coverPaper,
            innerPagesPaper,
            coverCoating,
            innerPageCoating,
            false,
            threadSewn,
            "standard"
        );
    }
}