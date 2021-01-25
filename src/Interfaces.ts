
import * as Product from "./Product";

/** ============ 通訊錯誤 ============ */
export interface TransactionErrorInterface extends Error {
    failureType: FailureType;
}

/** ============ 錯誤類型 ============ */
export enum FailureType {
    CONNECTION_FAILURE = "連線錯誤",
    PRECONDITION_FAILURE = "前置條件不符",
    POSTCONDITION_FAILURE = "後置條件無法完成",
    UNDEFINED_FAILURE = "未能歸類為以上三種"
}

/** ============ 通訊格式 ============ */
export interface TransactionResponse<T> {
    isFinished: boolean;
    error?: TransactionErrorInterface;
    data: T;
}

/** ============ 產品分類 ============ */
/**
 * @enum
 */

// 總共有的所有產品類別: 單張、書籍(騎馬釘、蝴蝶書、膠裝書) 
const PRODUCT_SUBTYPE_NAMES = [
    "SingleSheet",
    "SaddleStichBindingBook",
    "ButterflyBindingBook",
    "PerfectBindingBook"
] as const;

export type ProductSubtypeName = typeof PRODUCT_SUBTYPE_NAMES[number];

export const PRODUCT_SUBTYPES: {
    name: ProductSubtypeName; value: any
}[] = [
    { name : "SingleSheet", value: Product.SingleSheet },
    { name : "SaddleStichBindingBook", value: Product.SaddleStichBindingBook },
];

export interface ProductInterface {
    readonly __productSubType: ProductSubtypeName;
}

/**
 * 書籍
 * @enum  
 * 
 */
// 總共有的所有書籍類別: 騎馬釘、蝴蝶書、膠裝書
export const BOOK_SUBTYPE_NAMES = [
    "SaddleStichBindingBook",
    "ButterflyBindingBook",
    "PerfectBindingBook"
] as const;
export type BookSubtypeName = typeof BOOK_SUBTYPE_NAMES[number];
// 翻頁方式: 左翻與右翻
export const BOOK_PAGING_DIRECTIONS = [
    "LEFT_TO_RIGHT",
    "RIGHT_TO_LEFT"
] as const;
export type BookPagingDirection = typeof BOOK_PAGING_DIRECTIONS[number];

// 書籍參數
export interface BookInterface extends ProductInterface {
    readonly __productSubType: BookSubtypeName;
    readonly coverWidth: number;
    readonly coverHeight: number;
    readonly numberOfPages: number;
    readonly pagingDirection: BookPagingDirection;
    readonly coverPaperTexture: PaperInterface;
    readonly innerPagesPaperTexture: PaperInterface;
    readonly coverCoating?: CoatInterface;
    readonly innerPageCoating?: CoatInterface;
}
// 騎馬釘
export interface SaddleStichBindingBookInterface extends BookInterface {
    readonly __productSubType: "SaddleStichBindingBook";
}
// 蝴蝶書
export interface ButterflyBindingBookInterface extends BookInterface {
    readonly __productSubType: "ButterflyBindingBook";
}
// 膠裝
export interface PerfectBindingBookInterface extends BookInterface {
    readonly __productSubType: "PerfectBindingBook";
}


/**
 * 單張  
 * 
 */
export interface SingleSheetInterface extends ProductInterface  {
    readonly __productSubType: "SingleSheet";
    readonly width: number,
    readonly height: number,
    readonly isDoubleSided: boolean,
    readonly paper: PaperInterface,
    readonly frontSideCoat?: CoatInterface,
    readonly backSideCoat?: CoatInterface
}

/** ============ 產品組成 ============ */
// 紙張
export interface PaperInterface {
    readonly material: PaperMaterialInterface,
    readonly thickness: number,
    readonly isSmooth: boolean, // 表面是否光滑（會影響能否上膜）
    readonly description: string
}
// 紙質
export interface PaperMaterialInterface {
    readonly name: string;
    readonly aliases: Array<string>;
}
// 上模
export interface CoatInterface {
    readonly name: string;
    readonly chineseName: string;
}

/** ============ 計價參數 ============ */

export interface ComponentPricingConfigInterface {
    unitPrice: number;
    unit: string;
}
// 單張計價參數
export interface SingleSheetPricingConfigInterface {
    readonly coating: Array<CoatingPricingConfigInterface>;
    readonly printing: PrintingPricingConfigInterface;
    readonly paper: Array<PaperPricingConfigInterface>;
}
// 書籍計價參數
export interface BookPricingConfigInterface {
    readonly coating: Array<CoatingPricingConfigInterface>;
    readonly printing: PrintingPricingConfigInterface;
    readonly binding: Array<BookBindingPricingConfigInterface>;
    readonly paper: Array<PaperPricingConfigInterface>;
}
// 紙材計價
export interface PaperPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
    paper: PaperInterface;
}
// 上膜計價
export interface CoatingPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Page" | "SquareMeter"    // 以「一面／一平方公尺」為單位
    coat: CoatInterface;
}
// 印工計價
export interface PrintingPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
}
// 裝訂方式
export const BINDING_OPTIONS = [
    "SaddleStichBinding",
    "ButterflyBinding",
    "PerfectBinding"
] as const;
export type BindingOption = typeof BINDING_OPTIONS[number];

// 裝訂計價
export interface BookBindingPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Copy";                   // 以「一份（一本書）」為單位
    bindingStyle: BindingOption;
}


/** ============ 產品參數選項 ============ */
// 書籍可用選項:可用的紙質以及上膜
export interface BookProductionOptionsInterface {
    readonly validPaperTexturesForInnerPages: Array<PaperInterface>;
    readonly validPaperTexturesForCover: Array<PaperInterface>;
    readonly validCoatingStylesForInnerPages: Array<CoatInterface>;
    readonly validCoatingStylesorCover: Array<CoatInterface>;
}
// 單張可用選項:可用的紙質以及上膜
export interface SingleSheetProductionOptionsInterface {
    readonly validPaperTextures: Array<PaperInterface>;
    readonly validCoatingStyles: Array<PaperInterface>;
}



/** ============ 審稿 ============ */
// 審稿資訊物件
export interface ReviewItemInterface {
    readonly reviewId: string;
    readonly numberOfModels: number;
    readonly status: ReviewStatusInterface;
    readonly product: ProductInterface;
    readonly models: Map<number, ReviewModelInterface>;    
}
// 審稿狀態
export interface ReviewStatusInterface {
    readonly uploadFileStatuses: Array<UploadFileStatusInterface>;
    readonly progress: ReviewingProgress;
}
// 登記審稿資訊
export interface ReviewRegistrationInfoInterface {
    readonly numberOfModels: number;
    readonly product: Product.Product;
}
/**
 * @enum
 */
// 審稿狀態
export const REVIEWING_PROGRESS = [
    "REGISTERED", // '已登記審稿，但還沒開始上傳檔案',
    "UPLOADING", // '已經開始上傳檔案，但還有檔案沒上傳完畢',
    "GENERATING_PREVIEW_PAGES", // '所有檔案都上傳完畢，但還有檔案預覽圖在生成中',
    "WAITING_PRINTABLE_REVIEW", // '預覽圖都生成完畢，但使用者還在確認排版',
    "GENERATING_PRINTABLE_REVIEWED_PAGES", // '使用者已確認排版，但還有印刷檔在生成中',
    "WAITING_FOR_USER_CHECK", // '印刷檔都生成完畢，但使用者還沒確認最終結果',
    "FINISHED", // '使用者審稿完畢'
] as const;
export type ReviewingProgress = typeof REVIEWING_PROGRESS[number];

/**
 * @enum
 */
// 上傳檔案的狀態
export const UPLOAD_FILE_PROCESSING_STAGES = [
    "UPLOAD",                     // 已登記上傳檔案，但檔案還沒上傳完
    "GENERATING_PREVIEW_PAGES",   // 已收到上傳檔，但正在生成預覽圖
    "GENERATING_RESULTING_PAGES", // 已生成預覽圖，但PDF還沒好
    "FINISHED"                    // 處理完畢
] as const;

export type UploadFileProcessingStage = typeof UPLOAD_FILE_PROCESSING_STAGES[number];
// 上傳檔案的資訊
export interface UploadFileStatusInterface {
    readonly fileName: string;
    readonly currentStage: UploadFileProcessingStage;
    readonly hasError: boolean;
    readonly numberOfPages?: number;
    readonly fileAddress?: string;
    readonly previewPagesAddress?: Array<string>;
    readonly printablePagesAddress?: Array<string>;
    readonly errorStage?: UploadFileProcessingStage;   
}
// 審稿頁與框的配對
export interface ReviewModelInterface {
    readonly modelIndexInReviewItem: number;
    framedPages: Map<string, FramedPageInterface>;
}
// 審稿頁與框的資訊
export interface FramedPageInterface {
    inputPagePreviewAddress?: string;
    printableResultingImageAddress?: string;
    printableResultingFileAddress?: string;
    pageIndex: string; 
    positionX?: number;
    positionY?: number;
    scaleX?: number;
    scaleY?: number;
    rotationDegree?: number;
}