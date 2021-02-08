import { BookPagingDirection, BookSubtypeName, Book as BookInterface } from "../Interface";
import Coat from "../Material/Coat";
import Paper from "../Material/Paper";
import Product from "./Product";

export default abstract class Book extends Product implements BookInterface {
    readonly abstract __productSubType: BookSubtypeName
    constructor(
        public width: number,
        public height: number,
        public numberOfPages: number,
        public pagingDirection: BookPagingDirection,
        public coverPaper: Paper,
        public innerPagesPaper: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        ) {
        super();
    }

    /**
     * 書背寬度（mm）
     */
    public get spineWidth(): number {
        return this.numberOfPages / 2 * this.innerPagesPaper.thickness;
    }
}