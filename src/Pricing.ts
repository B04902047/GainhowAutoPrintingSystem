
import * as Product from "./Product";

export interface PriceCalculator {
    getPrice(): Promise<number>;
    getProduct(): Product.Product
}