import Book from "./Book";
import { BookPagingDirection, PerfectBoundBook as PerfectBoundBookInterface } from "../Interface";
import Paper from "../Material/Paper";
import Coat from "../Material/Coat";
import { Type } from "class-transformer";
import FrameDictionary from "../FrameDictionary/FrameDictionary";
import PerfectBoundBookFrameDictionary from "../FrameDictionary/PerfectBoundBookFrameDictionary";

export default abstract class PerfectBoundBook extends Book implements PerfectBoundBookInterface {
    readonly __productSubType = "PerfectBoundBook";

    @Type(() => Paper)
    public coverPaper!: Paper;

    @Type(() => Paper)
    public innerPagesPaper!: Paper;

    @Type(() => Coat)
    public coverCoating?: Coat;

    @Type(() => Coat)
    public innerPageCoating?: Coat;
    constructor(
        public width: number,
        public height: number,
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
            width,
            height,
            numberOfPages,
            pagingDirection,
            coverPaperTexture,
            innerPagesPaperTexture,
            coverCoating,
            innerPageCoating
        );
    }

    protected _frameDictionary?: FrameDictionary;
    protected createFrameDictionary(): FrameDictionary {
        return new PerfectBoundBookFrameDictionary(this);
    }
}