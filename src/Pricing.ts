
import * as Product from "./Product";

export abstract class PriceCalculator {
    public abstract loadPrice(): Promise<number>;
    protected abstract product: Product.Product;
    public getProduct(): Product.Product {
        return this.product;
    };
}

//實作方案一: 傳送產品資料，直接和AIPS取得價錢
abstract class BusyPriceRequestor extends PriceCalculator {
    protected readonly requestUrl: string;
}

//實作方案二: 取得產品參數，計算出價錢之後回傳
abstract class ConfiguratedPriceCalculator extends PriceCalculator {
    protected pricingConfig?: PricingConfig;
    protected async loadAndSetPricingConfig(): Promise<PricingConfig> {
        const pricingConfig = await this.loadPricingConfig();
        this.pricingConfig = pricingConfig;
        return pricingConfig;
    };
    public async loadPrice(): Promise<number> {
        if (this.pricingConfig) return this.calculatePriceWithPricingConfig(this.pricingConfig);
        const pricingConfig = await this.loadAndSetPricingConfig();
        return this.calculatePriceWithPricingConfig(pricingConfig);
    }
    protected abstract calculatePriceWithPricingConfig(pricingConfig: PricingConfig): number;
    protected abstract loadPricingConfig(): Promise<PricingConfig>;
}

class PricingConfig {
//「上膜」「裝訂」「紙張」和「印工」  單張沒有裝訂的Config
}

// ConfiguratedPriceCalculator的實作方式一 : 去資料庫取得
abstract class PricingConfigRequestor {
    protected readonly requestUrl: string;
    public abstract loadPricingConfig(): Promise<PricingConfig>;
}

abstract class SingletonRequestConfiguratedPriceCalculator extends ConfiguratedPriceCalculator {
    private static readonly instance: SingletonRequestConfiguratedPriceCalculator;
    protected abstract readonly pricingConfigRequestor: PricingConfigRequestor;
    protected constructor() {
        super();
    }
    public static getInstance(): SingletonRequestConfiguratedPriceCalculator {
        return this.instance;
    };
    protected async loadPricingConfig(): Promise<PricingConfig> {
        const pricingConfig = await this.pricingConfigRequestor.loadPricingConfig();
        return pricingConfig;
    };
}

// ConfiguratedPriceCalculator的實作方式二 : 直接寫死參數在code內
export abstract class HardCodeConfiguratePriceCalulator extends ConfiguratedPriceCalculator {
    constructor() {
        super();
        this.createAndSetPricingConfig();
    }
    public getOrCreatePricingConfig(): PricingConfig {
        if (!this.pricingConfig) this.createAndSetPricingConfig();
        return this.pricingConfig;
    };
    protected loadPricingConfig(): Promise<PricingConfig> {
        return Promise.resolve(this.getOrCreatePricingConfig());
    };
    private createAndSetPricingConfig(): PricingConfig {
        this.pricingConfig = this.createPricingConfig();
        return this.pricingConfig;
    }
    protected abstract createPricingConfig(): PricingConfig;
}

// 單頁的計價器 : 透過參數計算，並把參數直接寫死參數在code內
export class SingleSheetHardCodeConfiguratedPriceCalculator extends HardCodeConfiguratePriceCalulator {
    constructor(
        protected product: Product.SingleSheet
    ) {
        super();
    }
    protected createPricingConfig(): SingleSheetPricingConfig {
        return new SingleSheetPricingConfig();
    }
    protected calculatePriceWithPricingConfig(singleSheetPricingConfig: SingleSheetPricingConfig): number {
        throw new Error("Method not implemented.");
    }
}

class SingleSheetPricingConfig extends PricingConfig {
    constructor() {
        super();
        throw new Error("Method not implemented.");
    }
}

// 騎馬釘書籍的計價器 : 透過參數計算，並從資料庫取得Singleton的參數
export class SaddleStichBindingBookSingletonRequestConfiguratedPriceCalculator extends SingletonRequestConfiguratedPriceCalculator {
    constructor(
        protected product: Product.SaddleStichBindingBook
    ) {
        super();
    }
    protected pricingConfigRequestor: SaddleStichBindingBookPricingConfigRequestor
        = new SaddleStichBindingBookPricingConfigRequestor();
    protected calculatePriceWithPricingConfig(pricingConfig: PricingConfig): number {
        throw new Error("Method not implemented.");
    }
}

class SaddleStichBindingBookPricingConfigRequestor extends PricingConfigRequestor {
    public loadPricingConfig(): Promise<SaddleStichBindingBookPricingConfig> {
        throw new Error("Method not implemented.");
    }
}

abstract class BookPricingConfig extends PricingConfig {

}

class SaddleStichBindingBookPricingConfig extends BookPricingConfig {

}

// 蝴蝶裝書籍的計價器 : 透過參數計算，並從資料庫取得Singleton的參數
export class ButterflyBindingBookSingletonRequestConfiguratedPriceCalculator extends SingletonRequestConfiguratedPriceCalculator {
   
}
// 精裝書籍的計價器 : 透過參數計算，並從資料庫取得Singleton的參數
export class PerfectBindingBookSingletonRequestConfiguratedPriceCalculator extends SingletonRequestConfiguratedPriceCalculator {

}