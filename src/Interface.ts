

/** ============ 通訊錯誤 ============ */
export interface TransactionError extends Error {
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
    error?: TransactionError;
    data: T;
}

/** ============ 產品分類 ============ */

export type ProductSubtypeName
    = "SingleSheet"
    | BookSubtypeName;

export interface Product {
    readonly __productSubType: ProductSubtypeName;
}

/**
 * 書籍
 * @enum  
 * 
 */
// 總共有的所有書籍類別: 騎馬釘、蝴蝶書、膠裝書
export const BOOK_SUBTYPE_NAMES = [
    "SaddleStichedBook",    // 騎馬釘
    "PerfectBoundBook",     // 膠裝（平裝（純膠裝）／穿線膠裝／方背精裝／圓背精裝／穿線方背精裝／穿線圓背精裝）
] as const;
export type BookSubtypeName = typeof BOOK_SUBTYPE_NAMES[number];

// 翻頁方式: 左翻與右翻
export const BOOK_PAGING_DIRECTIONS = [
    "LEFT_TO_RIGHT",    // 直式由左往右翻
    "RIGHT_TO_LEFT",    // 直式由右往左翻
    "BOTTOM_TO_TOP"     // 橫式
] as const;
export type BookPagingDirection = typeof BOOK_PAGING_DIRECTIONS[number];

// 書籍參數
export interface Book extends Product {
    readonly __productSubType: BookSubtypeName;
    readonly width: number;                         // 成品寬
    readonly height: number;                        // 成品高
    readonly numberOfPages: number;                 // 總頁數
    readonly pagingDirection: BookPagingDirection;  // 翻頁方向
    readonly coverPaper: Paper;              // 封面紙張種類
    readonly innerPagesPaper: Paper;         // 內頁紙張種類
    readonly coverCoating?: Coat;                   // 封面上膜
    readonly innerPageCoating?: Coat;               // 內頁上膜
}

/**
 * 膠裝書
 */
export interface PerfectBoundBook extends Book {
    readonly __productSubType: "PerfectBoundBook";
    readonly hardCovered: boolean;      // 是否精裝（外加硬殼）
    readonly threadSewn: boolean;       // 是否穿線
    readonly spineStyle: "standard" | "rounded";    // 書背：方背／圓背
}

/**
 * 騎馬釘書
 */
export interface SaddleStichedBook extends Book {
    readonly __productSubType: "SaddleStichedBook";
}


/**
 * 單張
 */
export interface SingleSheet extends Product  {
    readonly __productSubType: "SingleSheet";
    readonly width: number,
    readonly height: number,
    readonly isDoubleSided: boolean,
    readonly paper: Paper,
    readonly frontSideCoat?: Coat,
    readonly backSideCoat?: Coat
}

/** ============ 產品組成 ============ */
// 紙張
export interface Paper {
    name: string;
    material: PaperMaterial;
    thickness: number; // 厚度（mm）
    weight: number;    // 單位面積重量（g/m^2）
    isSmooth: boolean; // 表面是否光滑（會影響能否上膜）
    description?: string;
}

// 紙質
export interface PaperMaterial {
    name: string;
    aliases?: Array<string>;
}
// 上模
export interface Coat {
    readonly name: string;
    readonly chineseName: string;
}

/** ============ 計價參數 ============ */

export interface ComponentPricingConfig {
    unitPrice: number;
    unit: string;
}
// 單張計價參數
export interface SingleSheetPricingConfig {
    readonly coating: Array<CoatingPricingConfig>;
    readonly printing: PrintingPricingConfig;
    readonly paper: Array<PaperPricingConfig>;
}
// 書籍計價參數
export interface BookPricingConfig {
    readonly coating: Array<CoatingPricingConfig>;
    readonly printing: PrintingPricingConfig;
    readonly binding: Array<BookBindingPricingConfig>;
    readonly paper: Array<PaperPricingConfig>;
}
// 紙材計價
export interface PaperPricingConfig extends ComponentPricingConfig {
    unit: "Meter" | "SquareMeter"   // 以「一公尺／一平方公尺」為單位
    paper: Paper;
}
// 上膜計價
export interface CoatingPricingConfig extends ComponentPricingConfig {
    unit: "Page" | "SquareMeter"    // 以「一面／一平方公尺」為單位
    coat: Coat;
}
// 印工計價
export interface PrintingPricingConfig extends ComponentPricingConfig {
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
export interface BookBindingPricingConfig extends ComponentPricingConfig {
    unit: "Copy";                   // 以「一份（一本書）」為單位
    bindingStyle: BindingOption;
}

/** ============ 產品參數選項 ============ */
// 書籍可用選項:可用的紙質以及上膜
export interface BookProductionOptions {
    readonly validPaperTexturesForInnerPages: Array<Paper>;
    readonly validPaperTexturesForCover: Array<Paper>;
    readonly validCoatingStylesForInnerPages: Array<Coat>;
    readonly validCoatingStylesorCover: Array<Coat>;
}
// 單張可用選項:可用的紙質以及上膜
export interface SingleSheetProductionOptions {
    readonly validPaperTextures: Array<Paper>;
    readonly validCoatingStyles: Array<Paper>;
}


/** ============ 審稿 ============ */
// 審稿資訊物件
export interface ReviewItem {
    status: ReviewStatus;
    product: Product;
    models: Map<number, ReviewModel>;    
}
// 審稿狀態
export interface ReviewStatus {
    reviewId: string;
    numberOfModels: number;
    modelIds: Array<string>;
    numberOfFiles: number;
    uploadFileStatuses: Array<UploadFileStatus>;
    progress: ReviewingProgress;
}
// 登記審稿資訊
export interface ReviewRegistrationInfo {
    numberOfModels: number;
    product: Product;
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
    "GENERATING_PRINTABLE_PAGES",   // 已收到上傳檔，但正在生成每一頁單獨的PDF和JPEG
    "FINISHED"                    // 處理完畢
] as const;

export type UploadFileProcessingStage = typeof UPLOAD_FILE_PROCESSING_STAGES[number];
// 上傳檔案的資訊
export interface UploadFileStatus {
    fileName: string;
    fileId: string;
    currentStage: UploadFileProcessingStage;
    hasError: boolean;
    numberOfPages?: number;
    fileAddress?: string;
    previewPagesAddress?: Array<string>;
    printablePagesAddress?: Array<string>;
    errorStage?: UploadFileProcessingStage;   
}
// 審稿頁與框的配對
export interface ReviewModel {
    readonly modelIndexInReviewItem: number;
    framedPages: Map<string, FramedPage>;
}
// 審稿頁與框的資訊
export interface FramedPage {
    sourcePageImageFileId?: string;
    sourcePagePrintableFileId?: string;
    resultingImageFileId?: string;
    resultingPrintableFileId?: string;
    pageIndex: string; 
    positionX?: number;
    positionY?: number;
    scaleX?: number;
    scaleY?: number;
    rotationDegree?: number;
}


/** ============ 集單＆組版 ============ */
// 數位印刷機
export interface Printer {
	needJdf: boolean;
	jdfRequestUrl?: string;
	paperStockLimits: PaperStockLimits;
	validPaperNames: string[];
};

// 紙材限制
interface PaperStockLimits {
	stockType: "sheet" | "roll";    // 紙材類型：單張／卷裝
	maxWidth: number;               // 寬度上限
	minWidth: number;               // 寬度下限
	maxHeight: number;              // 高度上限
	minHeight: number;              // 高度下限
	maxThickness: number;           // 厚度上限
	minThickness: number;           // 厚度下限
};
