import { Book } from "./Book";
import {BookPagingDirection, PerfectBoundBook as PerfectBoundBookInterface} from "../Interface";
import { Paper } from "../Material/Paper";
import { Coat } from "../Material/Coat";
import { Type } from "class-transformer";

export abstract class PerfectBoundBook extends Book implements PerfectBoundBookInterface {
    readonly __productSubType = "PerfectBoundBook";

    @Type(() => Paper)
    public coverPaperTexture!: Paper;

    @Type(() => Paper)
    public innerPagesPaperTexture!: Paper;

    @Type(() => Coat)
    public coverCoating?: Coat;

    @Type(() => Coat)
    public innerPageCoating?: Coat;
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public pagingDirection: BookPagingDirection,
        coverPaperTexture: Paper,
        innerPagesPaperTexture: Paper,
        coverCoating?: Coat,
        innerPageCoating?: Coat,
        public hardCovered: boolean = false,
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
            innerPageCoating
        );
    }
}