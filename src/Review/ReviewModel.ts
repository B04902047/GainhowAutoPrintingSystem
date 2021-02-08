
import { deserialize, Exclude, Expose, Type } from "class-transformer";
import Frame from "../Frame/Frame";
import FrameDictionary from "../FrameDictionary/FrameDictionary";
import { ReviewModel as ReviewModelInterface} from "../Interface";
import FramedPage from "./FramedPage";
import ReviewItem from "./ReviewItem";

export default class ReviewModel implements ReviewModelInterface {

    @Exclude()
    protected _framedPages: Map<string, FramedPage> = new Map();

    @Exclude()
    protected _frameDictionary?: FrameDictionary;

    @Exclude()
    public reviewItem: ReviewItem;

    constructor(
        public readonly modelIndexInReviewItem: number,
        reviewItem: ReviewItem
    ) {
        this.reviewItem = reviewItem;
        this.createAndSetBlankFramedPages();
    }

    public getFrame(index: string): Frame | undefined {
        return this.frameDictionary.getFrame(index);
    }

    @Expose()
    @Type(() => FramedPage)
    public get framedPages(): Map<string, FramedPage> {
        if (this._framedPages.size !== this.numberOfFramedPages) return this.createAndSetBlankFramedPages();
        return this._framedPages;
    }

    @Expose({toPlainOnly: true})
    public get numberOfFramedPages(): number {
        return this.frameIndices.length;
    }
    public set framedPages(framedPages: Map<string, FramedPage>) {
        if (framedPages.size !== this.numberOfFramedPages) throw new Error("map size inconsistent");
        this._framedPages = framedPages;
    }
    protected createAndSetBlankFramedPages(): Map<string, FramedPage> {
        this.framedPages = this.createBlankFramedPages();
        return this.framedPages;
    }

    protected createBlankFramedPages(): Map<string, FramedPage> {
        let framedPages = new Map();
        let frameIndices = this.frameIndices;
        for (const frameIndex of frameIndices) {
            framedPages.set(
                frameIndex,
                new FramedPage(
                    frameIndex,
                    this
                )
            )
        }
        return framedPages;
    }
    protected get frameIndices(): Array<string> {
        return this.frameDictionary.frameIndices;
    }
    public get frameDictionary(): FrameDictionary {
        if (!this._frameDictionary) return this.getAndSetFrameDictionary();
        return this._frameDictionary;
    }
    protected getAndSetFrameDictionary(): FrameDictionary {
        this._frameDictionary = this.reviewItem.frameDictionary;
        return this._frameDictionary;
    }
}