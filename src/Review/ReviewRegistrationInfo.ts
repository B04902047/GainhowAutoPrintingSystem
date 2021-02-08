import Product from "../Product/Product";
import { ReviewRegistrationInfo as ReviewRegistrationInfoInterface } from "../Interface";
import { deserialize, serialize, Type } from "class-transformer";
import { PRODUCT_TYPE_DISCRIMINATOR } from "../Product";

export default class ReviewRegistrationInfo implements ReviewRegistrationInfoInterface {
    
    @Type(() => Product, {
        discriminator: PRODUCT_TYPE_DISCRIMINATOR
    })
    public readonly product: Product;
    constructor (
        public readonly numberOfModels: number,
        product: Product,
    ) {
        this.product = product;
    }

    public static toJson(info: ReviewRegistrationInfo) {
        return serialize(info);
    }

    public static fromJson(text: string): ReviewRegistrationInfo {
        return deserialize(ReviewRegistrationInfo, text);
    }
}