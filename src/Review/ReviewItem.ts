
import FrameDictionary from "../FrameDictionary/FrameDictionary";
import Product from "../Product/Product";
import { PRODUCT_TYPE_DISCRIMINATOR } from "../Product"
import ReviewModel from "./ReviewModel";
import ReviewStatus from "./ReviewStatus";
import { deserialize, Exclude, Expose, serialize, Type } from "class-transformer";
import FramedPage from "./FramedPage";
export default class ReviewItem implements ReviewItem {
    
    @Exclude()
    protected _models: Map<number, ReviewModel> = new Map();

    @Type(() => ReviewStatus)
    public readonly status: ReviewStatus;

    @Type(() => Product, {
        discriminator: PRODUCT_TYPE_DISCRIMINATOR
    })
    public readonly product: Product;
    
    constructor(
        status: ReviewStatus,
        product: Product, 
    ) {
        this.status = status;
        this.product = product;
        this.createAndSetBlankModels();
    }

    public get reviewId(): string {
        return this.status.reviewId;
    }
    public get numberOfModels(): number {
        return this.status.numberOfModels;
    }

    public set models(models: Map<number, ReviewModel>) {
        if (models.size !== this.numberOfModels) {
            throw new Error(`number of models inconsistent: should be ${this.numberOfModels}, but has ${models.size}`);
        }
        this._models = models;
    }

    @Expose()
    @Type(() => ReviewModel)
    public get models(): Map<number, ReviewModel> {
        if (this._models.size !== this.numberOfModels) return this.createAndSetBlankModels();
        return this._models;
    }

    protected createAndSetBlankModels(): Map<number, ReviewModel> {
        this.models = this.createBlankModels();
        return this.models;
    }
    protected createBlankModels(): Map<number, ReviewModel> {
        let models = new Map<number, ReviewModel>();
        for (let modelIndex: number = 1; modelIndex <= this.numberOfModels; modelIndex++) {
            models.set(
                modelIndex,
                new ReviewModel(modelIndex, this)
            );
        }
        return models;
    }

    public get frameDictionary(): FrameDictionary {
        return this.product.frameDictionary;
    }

    public static fromJson(text: string): ReviewItem {
        let item: ReviewItem = deserialize(ReviewItem, text);
        item.models.forEach((model: ReviewModel) => {
            model.reviewItem = item;
            model.framedPages.forEach((framedPage: FramedPage) => {
                framedPage.reviewModel = model;
            });
        });
        return item;
    }
    public static toJson(item: ReviewItem): string {
        return serialize(item);
    }
}