
import * as Product from "./Product";

/**
 * @enum
 */
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
 * @enum
 */
export const BOOK_SUBTYPE_NAMES = [
    "SaddleStichBindingBook",
    "ButterflyBindingBook",
    "PerfectBindingBook"
] as const;
export type BookSubtypeName = typeof BOOK_SUBTYPE_NAMES[number];

export interface BookInterface extends ProductInterface {
    readonly __productSubType: BookSubtypeName;
    readonly coverWidth: number;
    readonly coverHeight: number;
    readonly numberOfPages: number;
    readonly coverPaperTexture: PaperInterface;
    readonly innerPagesPaperTexture: PaperInterface;
    readonly coverCoating?: CoatInterface;
    readonly innerPageCoating?: CoatInterface;
}

export interface SaddleStichBindingBookInterface extends BookInterface {
    readonly __productSubType: "SaddleStichBindingBook";
}

export interface ButterflyBindingBookInterface extends BookInterface {
    readonly __productSubType: "ButterflyBindingBook";
}

export interface PerfectBindingBookInterface extends BookInterface {
    readonly __productSubType: "PerfectBindingBook";
}


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

export interface SingleSheetInterface extends ProductInterface  {
    readonly __productSubType: "SingleSheet";
    readonly width: number,
    readonly height: number,
    readonly isDoubleSided: boolean,
    readonly paper: PaperInterface,
    readonly frontSideCoat?: CoatInterface,
    readonly backSideCoat?: CoatInterface
}

export interface ReviewItemInterface {
    readonly reviewId: string;
    readonly numberOfModels: number;
    readonly status: ReviewStatusInterface;
    readonly product: ProductInterface;
    readonly models: Map<number, ReviewModelInterface>;    
}

export interface ReviewStatusInterface {
    readonly uploadFileStatuses: Array<UploadFileStatusInterface>;
    readonly progress: ReviewingProgress;
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

export interface PricingConfigInterface {
    unitPrice: number;
    unit: string;
}

export interface PaperPricingConfigInterface extends PricingConfigInterface {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
    paper: PaperInterface;
}

export interface CoatingPricingConfigInterface extends PricingConfigInterface {
    unit: "Page" | "SquareMeter"    // 以「一面／一平方公尺」為單位
    coat: CoatInterface;
}

export interface PrintingPricingConfigInterface extends PricingConfigInterface {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
}

export const BINDING_OPTIONS = [
    "SaddleStichBinding",
    "ButterflyBinding",
    "PerfectBinding"
] as const;
export type BindingOption = typeof BINDING_OPTIONS[number];

export interface BookBindingPricingConfigInterface extends PricingConfigInterface {
    unit: "Copy";                   // 以「一份（一本書）」為單位
    bindingStyle: BindingOption;
}