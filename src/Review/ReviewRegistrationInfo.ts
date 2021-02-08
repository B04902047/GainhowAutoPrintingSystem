import Product from "../Product/Product";
import {ReviewRegistrationInfo as ReviewRegistrationInfoInterface} from "../Interface";

export default class ReviewRegistrationInfo implements ReviewRegistrationInfoInterface {
    constructor (
        public readonly numberOfModels: number,
        public readonly product: Product,
    ) {}
}