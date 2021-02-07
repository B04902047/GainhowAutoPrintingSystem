import { BookPagingDirection, BookSubtypeName, Book as BookInterface } from "../Interface";
import { Coat } from "../Material/Coat";
import { Paper } from "../Material/Paper";
import { Product } from "./Product";

export abstract class Book extends Product implements BookInterface {
    readonly abstract __productSubType: BookSubtypeName
    constructor(
        public coverWidth: number,
        public coverHeight: number,
        public numberOfPages: number,
        public pagingDirection: BookPagingDirection,
        public coverPaperTexture: Paper,
        public innerPagesPaperTexture: Paper,
        public coverCoating?: Coat,
        public innerPageCoating?: Coat,
        ) {
        super();
    }
}