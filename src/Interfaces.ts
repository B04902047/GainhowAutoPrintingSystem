
import * as Product from "./Product";

/** ============ 通訊錯誤 ============ */
export interface TransactionErrorInterface extends Error {
    failureType: FailureType;
}

export enum FailureType {
    CONNECTION_FAILURE = "連線錯誤",
    PRECONDITION_FAILURE = "前置條件不符",
    POSTCONDITION_FAILURE = "後置條件無法完成",
    UNDEFINED_FAILURE = "未能歸類為以上三種"
}

export interface TransactionResponse<T> {
    isFinished: boolean;
    error?: TransactionErrorInterface;
    data: T;
}

/** ============ 產品分類 ============ */

export type ProductSubtypeName
    = "SingleSheet"
    | BookSubtypeName;

export const PRODUCT_SUBTYPES: {
    name: ProductSubtypeName; value: any
}[] = [
    { name : "SingleSheet", value: Product.SingleSheet },
    { name : "SaddleStichedBook", value: Product.SaddleStichBindingBook },
];

export interface ProductInterface {
    readonly __productSubType: ProductSubtypeName;
}

/**
 * @enum
 */
export const BOOK_SUBTYPE_NAMES = [
    "SaddleStichedBook",    // 騎馬釘
    "PerfectBoundBook",     // 膠裝（純膠裝／穿線膠裝／方背精裝／圓背精裝／穿線方背精裝／穿線圓背精裝）
    "EqualSoftcoverBook",   // 平裝
] as const;
export type BookSubtypeName = typeof BOOK_SUBTYPE_NAMES[number];

export const BOOK_PAGING_DIRECTIONS = [
    "LEFT_TO_RIGHT",    // 直式由左往右翻
    "RIGHT_TO_LEFT",    // 直式由右往左翻
    "BOTTOM_TO_TOP"     // 橫式
] as const;
export type BookPagingDirection = typeof BOOK_PAGING_DIRECTIONS[number];

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

export interface SaddleStichedBook extends BookInterface {
    readonly __productSubType: "SaddleStichedBook";
}
export interface PerfectBoundBook extends BookInterface {
    readonly __productSubType: "PerfectBoundBook";
    readonly hardCovered: boolean;      // 是否精裝（外加硬殼）
    readonly threadSewn: boolean;       // 是否穿線
    readonly spineStyle: "standard" | "rounded";
}

export interface EqualSoftcoverBook extends BookInterface {
    readonly __productSubType: "EqualSoftcoverBook";
}

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

export interface PaperInterface {
    readonly material: PaperMaterialInterface,
    readonly thickness: number,
    readonly isSmooth: boolean, // 表面是否光滑（會影響能否上膜）
    readonly description: string
}

export interface PaperMaterialInterface {
    readonly name: string;
    readonly aliases: Array<string>;
}

export interface CoatInterface {
    readonly name: string;
    readonly chineseName: string;
}

/** ============ 計價參數 ============ */

export interface ComponentPricingConfigInterface {
    unitPrice: number;
    unit: string;
}

export interface SingleSheetPricingConfigInterface {
    readonly coating: Array<CoatingPricingConfigInterface>;
    readonly printing: PrintingPricingConfigInterface;
    readonly paper: Array<PaperPricingConfigInterface>;
}

export interface BookPricingConfigInterface {
    readonly coating: Array<CoatingPricingConfigInterface>;
    readonly printing: PrintingPricingConfigInterface;
    readonly binding: Array<BookBindingPricingConfigInterface>;
    readonly paper: Array<PaperPricingConfigInterface>;
}

export interface PaperPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
    paper: PaperInterface;
}

export interface CoatingPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Page" | "SquareMeter"    // 以「一面／一平方公尺」為單位
    coat: CoatInterface;
}

export interface PrintingPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
}

export const BINDING_OPTIONS = [
    "SaddleStichBinding",
    "ButterflyBinding",
    "PerfectBinding"
] as const;
export type BindingOption = typeof BINDING_OPTIONS[number];

export interface BookBindingPricingConfigInterface extends ComponentPricingConfigInterface {
    unit: "Copy";                   // 以「一份（一本書）」為單位
    bindingStyle: BindingOption;
}

/** ============ 產品參數選項 ============ */

export interface BookProductionOptionsInterface {
    readonly validPaperTexturesForInnerPages: Array<PaperInterface>;
    readonly validPaperTexturesForCover: Array<PaperInterface>;
    readonly validCoatingStylesForInnerPages: Array<CoatInterface>;
    readonly validCoatingStylesorCover: Array<CoatInterface>;
}

export interface SingleSheetProductionOptionsInterface {
    readonly validPaperTextures: Array<PaperInterface>;
    readonly validCoatingStyles: Array<PaperInterface>;
}


/** ============ 審稿 ============ */

export interface ReviewItemInterface {
    readonly reviewId: string;
    readonly numberOfModels: number;
    readonly status: ReviewStatusInterface;
    readonly product: ProductInterface;
    readonly models: Map<number, ReviewModelInterface>;    
}

export interface ReviewStatusInterface {
    readonly uploadFileStatuses: Map<string, UploadFileStatusInterface>;
    readonly progress: ReviewingProgress;
}

export interface ReviewRegistrationInfoInterface {
    readonly numberOfModels: number;
    readonly product: ProductInterface;
}

/**
 * @enum
 */
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
export const UPLOAD_FILE_PROCESSING_STAGES = [
    "UPLOAD",                     // 已登記上傳檔案，但檔案還沒上傳完
    "GENERATING_PREVIEW_PAGES",   // 已收到上傳檔，但正在生成預覽圖
    "GENERATING_RESULTING_PAGES", // 已生成預覽圖，但PDF還沒好
    "FINISHED"                    // 處理完畢
] as const;

export type UploadFileProcessingStage = typeof UPLOAD_FILE_PROCESSING_STAGES[number];

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

export interface ReviewModelInterface {
    readonly modelIndexInReviewItem: number;
    framedPages: Map<string, FramedPageInterface>;
}

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