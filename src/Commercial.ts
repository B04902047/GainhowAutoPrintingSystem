import * as Product from "./Product";
import * as Ordering from "./Ordering";
import * as Review from "./Review";
class Member {
    private userDefinedProducts?: Array<ProductPrototype>;
    private orderHistory?: Array<Ordering.OrderImage>;
    private shoppingCart?: ShoppingCart;
    constructor(
        readonly accountId: string,
    ) {}
    
    public getDiscount(): number {}
    
    public logout(): Promise<void> {}

    public getOrLoadShoppingCart(): Promise<ShoppingCart> {
        if (this.shoppingCart) return Promise.resolve(this.shoppingCart);
        return this.loadAndSetShoppingCart(); 
    }

    private async loadAndSetShoppingCart(): Promise<ShoppingCart> {
        try {
            this.shoppingCart = await this.loadShoppingCart();
            return this.shoppingCart;
        } catch {
            // TODO: error handling
        }
    }

    private loadShoppingCart(): Promise<ShoppingCart> {
        //TODO : 跟server拿使用者的購物車資料，並將資料set到this.shoppingCart;
    }

    public getOrLoadOrderingHistory(): Promise<Array<Ordering.OrderImage>> {
        if (this.orderHistory) return Promise.resolve(this.orderHistory);
        return this.loadAndSetOrderingHistory(); 
    }

    private loadAndSetOrderingHistory(): Promise<Array<Ordering.OrderImage>> {
        //TODO : 跟server拿使用者儲存的樣板，並將資料set到this.orderHistory;
    }

    public getOrLoadUserDefinedProducts(): Promise<Array<ProductPrototype>> {
        if (this.userDefinedProducts) return Promise.resolve(this.userDefinedProducts);
        return this.loadAndSetUserDefinedProducts(); 
    }

    private loadAndSetUserDefinedProducts(): Promise<Array<ProductPrototype>> {
        //TODO : 跟server拿使用者儲存的樣板，並將資料set到this.userDefinedProducts;
    }

    public addUserDefinedProducts(): Promise<void> {}
    private updateToServer(): Promise<void> {}
    private reloadFromServer(): Promise<void> {}
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
    private member?: Member;
    constructor (
        private shoppingCartItems: {[itemIndex: string]:ShoppingCartItem}
    ) {
        
    }
}

class Order {

}

class ProductPrototype {
    name: string;
    productEncoding: Product.ProductEncoding;


}