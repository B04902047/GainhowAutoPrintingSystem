import * as Product from "./Product";
import * as Ordering from "./Ordering";
import * as Review from "./Review";
class Member {
    private userDefinedProducts?: Array<ProductPrototype>;
    private orderHistory?: Ordering.OrderImage;
    constructor(
        readonly accountId: string,
        private shoppingCart: ShoppingCart,
    ) {
        
       
    }

    getDiscount(): number {
        
    }
    
    logout(): Promise<void> {

    }

    getOrLoadUserDefinedProducts(): Promise<Array<ProductPrototype>> {
        if (this.userDefinedProducts) return Promise.resolve(this.userDefinedProducts);
        return this.loadAndSetUserDefinedProducts(); 
    }

    loadAndSetUserDefinedProducts(): Promise<Array<ProductPrototype>> {
      //TODO : 跟server拿使用者儲存的樣板，並將資料set到this.userDefinedProducts;
        
    }

    addUserDefinedProducts(): Promise<void> {

    }

}


abstract class ShoppingCartItem {
    protected reviewId?: string;  //由regestor去賦值
    constructor (
        private product: Product.Product,
        public numberOfModels: number = 1,
        public numberOfCopiesPerModel: number,
    ) {
        
    }
    public getReviewId(): string | undefined {
        return this.reviewId;
    };
    public abstract getTotalPrice(): Promise<number>;
    /**
     * 
     * ! 回傳值需要修改/再想想，可能是統一規定的一種通訊type
     */
    public abstract registerItemToReviewAndSetReviewId(): Promise<boolean>;
    public hasRegieseredForReview(): boolean {
        if (this.reviewId) return true;
        return false;
    }
    private toReviewRegistrationInfo(): Review.ReviewRegistrationInfo {

    }

}

class ShoppingCart {
    constructor (
        private ShoppingCartItems: {[itemIndex: string]:ShoppingCartItem}
    ) {
        
    }
}

class Order {

}

class ProductPrototype {
    name: string;
    productEncoding: Product.ProductEncoding;


}