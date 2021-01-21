import * as Product from "./Product";
import * as Review from "./Review";
import { FailureType, TransactionError } from "./Transaction";

abstract class ClassEncoding {
    constructor(
        readonly className: string,
        readonly isAbstract: boolean
    ) {}
    public static toJson(code: ClassEncoding): string {
        return JSON.stringify(code);
    }
    public static fromJson(text: string): any | null {
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    }
    public static is(code: any): code is ClassEncoding {
        if (!code.className) return false;
        if (!(code.isAbstract === true || code.isAbstract === false)) return false;
        return true;
    }
}

abstract class ConcreteClassEncoding extends ClassEncoding {
    readonly isAbstract: false = false;
    constructor(
        readonly className: string,
        readonly subclassName?: string,
        readonly subclassEncoding?: ClassEncoding
    ) {
        super(className, false);
    }
}

class AbstractClassEncoding extends ClassEncoding {
    readonly isAbstract: true = true;
    constructor(
        readonly className: string,
        readonly subclassName: string,
        readonly subclassEncoding: ClassEncoding
    ) {
        super(className, true);
    }
    public static is(code: any): code is AbstractClassEncoding {
        if (code.isAbstract !== true) return false;
        if (!code.subclassName) return false;
        if (!code.subclassEncoding) return false;
        if (!ClassEncoding.is(code)) return false;
        return true;
    }
}

enum ProductSubclassName {
    BOOK = "Book",
    SINGLE_SHEET = "SingleSheet"
}

type ProductSubclassEncoding = BookEncoding | SingleSheetEncoding;

export class ProductEncoding extends AbstractClassEncoding {
    constructor(
        readonly subclassName: ProductSubclassName,
        readonly subclassEncoding: ProductSubclassEncoding
    ) {
        super(
            "Product",
            subclassName,
            subclassEncoding
        );
    }

    /**
     * @override
     */
    public static is(code: any): code is ProductEncoding {
        if (code.isAbstract !== true) return false;
        if (code.className !== "Product") return false;
        let subclassEncoding = code.subclassEncoding;
        switch (code.subclassName) {
            case ProductSubclassName.BOOK:
                return BookEncoding.is(subclassEncoding);
            case ProductSubclassName.SINGLE_SHEET:
                return SingleSheetEncoding.is(subclassEncoding);
            default:
                return false;
        }
        
    }
    public static decode(json: string): Product.Product | null {
        let object: any | null = this.fromJson(json);
        if (!this.is(object)) return null;
        return this.toInstance(object);
    }
    public static encode(product: Product.Product): string {
        let productEncoding = this.fromInstance(product);
        return this.toJson(productEncoding);
    }
    public static fromSubclassEncoding(subclassEncoding: ProductSubclassEncoding): ProductEncoding {
        return new ProductEncoding(
            subclassEncoding.className,
            subclassEncoding
        );
    }
    public static fromInstance(product: Product.Product): ProductEncoding {
        if (BookEncoding.isInstance(product)) return BookEncoding.fromInstance(product);
        if (SingleSheetEncoding.isInstance(product)) return SingleSheetEncoding.fromInstance(product);
        // TODO: throw exception: 試圖encode還沒有跟我們登記的東西
        throw new TransactionError(FailureType.PRECONDITION_FAILURE, "試圖encode還沒有跟我們登記encode的product");
    }
    public static isInstance(object: any): object is Product.Product {
        return (BookEncoding.isInstance(object)
            || SingleSheetEncoding.isInstance(object)
            );
    }
    public static toInstance(encoding: ProductEncoding): Product.Product {
        switch (encoding.subclassName) {
            case ProductSubclassName.BOOK:
                return BookEncoding.toInstance(encoding.subclassEncoding as BookEncoding);
            case ProductSubclassName.SINGLE_SHEET:
                return SingleSheetEncoding.toInstance(encoding.subclassEncoding as SingleSheetEncoding);
        }
    }
}

enum BookSubclassName {
    SADDLE_STICH_BINDING_BOOK = "SaddleStichBindingBook",
    PERFECT_BINDING_BOOK = "PerfectBindingBook",
    BUTTERFLY_BINDING_BOOK = "ButterflyBindingBook"
}

type BookSubclassEncoding
    = SaddleStichBindingBookEncoding
    | PerfectBindingBookEncoding
    | ButterflyBindingBookEncoding;

class BookEncoding extends AbstractClassEncoding {
    readonly className: ProductSubclassName = ProductSubclassName.BOOK;
    readonly subclassName: BookSubclassName;
    constructor (
        readonly subclassEncoding: BookSubclassEncoding
    ) {
        super(
            ProductSubclassName.BOOK,
            subclassEncoding.className,
            subclassEncoding
        );
        this.subclassName = subclassEncoding.className;
    }

    public static is(code: any): code is BookEncoding {
        if (code.className !== ProductSubclassName.BOOK) return false;
        switch (code.subclassName) {
            case BookSubclassName.BUTTERFLY_BINDING_BOOK:
                return ButterflyBindingBookEncoding.is(code.subclassEncoding);
            case BookSubclassName.PERFECT_BINDING_BOOK:
                return PerfectBindingBookEncoding.is(code.subclassEncoding);
            case BookSubclassName.SADDLE_STICH_BINDING_BOOK:
                return SaddleStichBindingBookEncoding.is(code.subclassEncoding);
            default:
                return false;
        }
    }
    public static isInstance(object: any): object is Product.Book {
        return (Object.values(BookSubclassName).includes(object.constructor.name));
    }
    public static toInstance(encoding: BookEncoding): Product.Book {
        let subclassEncoding: BookSubclassEncoding = encoding.subclassEncoding;
        switch (encoding.subclassName) {
            case BookSubclassName.SADDLE_STICH_BINDING_BOOK:
                return SaddleStichBindingBookEncoding.toInstance(subclassEncoding as SaddleStichBindingBookEncoding);
            case BookSubclassName.PERFECT_BINDING_BOOK:
                return PerfectBindingBookEncoding.toInstance(subclassEncoding as PerfectBindingBookEncoding);
            case BookSubclassName.BUTTERFLY_BINDING_BOOK:
                return ButterflyBindingBookEncoding.toInstance(subclassEncoding as ButterflyBindingBookEncoding);    
        }
    }
    public static fromSubclassEncoding(subclassEncoding: BookSubclassEncoding): ProductEncoding {
        let bookEncoding = new BookEncoding(
            subclassEncoding
        );
        return ProductEncoding.fromSubclassEncoding(bookEncoding);
    }
    public static fromInstance(book: Product.Book): ProductEncoding {
        switch (book.constructor.name as BookSubclassName) {
            case BookSubclassName.SADDLE_STICH_BINDING_BOOK:
                return SaddleStichBindingBookEncoding.fromInstance(book as Product.SaddleStichBindingBook);
            case BookSubclassName.PERFECT_BINDING_BOOK:
                return PerfectBindingBookEncoding.fromInstance(book as Product.PerfectBindingBook);
            case BookSubclassName.BUTTERFLY_BINDING_BOOK:
                return ButterflyBindingBookEncoding.fromInstance(book as Product.ButterflyBindingBook);    
        }
    }
}

class SaddleStichBindingBookEncoding extends ConcreteClassEncoding {
    className: BookSubclassName = BookSubclassName.SADDLE_STICH_BINDING_BOOK;
    constructor(
        readonly coverWidth: number, 
        readonly coverHeight: number, 
        readonly numberOfPages: number, 
        readonly coverPaperTexture: Product.Paper,
        readonly innerPagesPaperTexture: Product.Paper, 
        readonly coverCoating?: Product.Coat, 
        readonly innerPageCoating?: Product.Coat
    ) {
        super(
            BookSubclassName.SADDLE_STICH_BINDING_BOOK,
        );
    }
    public static is(code: any): code is SaddleStichBindingBookEncoding {
        if (typeof code.coverWidth !== "number") return false;
        if (typeof code.coverHeight !== "number") return false; 
        if (typeof code.numberOfPages !== "number") return false; 
        if (!PaperEncoding.is(code.coverPaperTexture)) return false;
        if (!PaperEncoding.is(code.innerPagesPaperTexture)) return false;
        if ((typeof code.coverCoating !== "undefined")
            && !CoatEncoding.is(code.coverCoating)
        ) return false;
        if ((typeof code.innerPageCoating !== "undefined")
            && !CoatEncoding.is(code.innerPageCoating)
        ) return false;
        return true;
    }
    public static encode(saddleStichBindingBook: Product.SaddleStichBindingBook): string {
        let encoding: ProductEncoding = this.fromInstance(saddleStichBindingBook);
        return this.toJson(encoding);
    }
    public static toInstance(encoding: SaddleStichBindingBookEncoding): Product.SaddleStichBindingBook {
        return new Product.SaddleStichBindingBook(
            encoding.coverWidth,
            encoding.coverHeight, 
            encoding.numberOfPages, 
            encoding.coverPaperTexture,
            encoding.innerPagesPaperTexture, 
            encoding.coverCoating, 
            encoding.innerPageCoating
        );
    }
    public static fromInstance(product: Product.SaddleStichBindingBook): ProductEncoding {
        let saddleStichBindingBookEncoding = new SaddleStichBindingBookEncoding(
            product.coverWidth,
            product.coverHeight, 
            product.numberOfPages, 
            product.coverPaperTexture,
            product.innerPagesPaperTexture, 
            product.coverCoating, 
            product.innerPageCoating
        );
        return BookEncoding.fromSubclassEncoding(saddleStichBindingBookEncoding);
    }
}
class PerfectBindingBookEncoding extends ConcreteClassEncoding {
    className: BookSubclassName = BookSubclassName.PERFECT_BINDING_BOOK;
}
class ButterflyBindingBookEncoding extends ConcreteClassEncoding {
    className: BookSubclassName = BookSubclassName.BUTTERFLY_BINDING_BOOK;
}

class PaperEncoding extends ConcreteClassEncoding {
    constructor(
        readonly material: Product.PaperMaterial,
        readonly thickness: number,
        readonly isSmooth: boolean, // 表面是否光滑（會影響能否上膜）
        readonly description: string
    ) {
        super("Paper");
    }
    public static is(code: any): code is PaperEncoding {
        if (!PaperMaterialEncoding.is(code.material)) return false;
        if (typeof code.thickness !== "number") return false;
        if (typeof code.isSmooth !== "boolean") return false;
        if (typeof code.description !== "string") return false;
        return true;
    }
    public static fromInstance(paper: Product.Paper): PaperEncoding {
        return new PaperEncoding(
            paper.material,
            paper.thickness,
            paper.isSmooth,
            paper.description
        );
    }
    public static toInstance(encoding: PaperEncoding): Product.Paper {
        return new Product.Paper(
            encoding.material,
            encoding.thickness,
            encoding.isSmooth,
            encoding.description
        );
    }
}

export class PaperMaterialEncoding extends ConcreteClassEncoding {
    constructor(
        readonly name: string,
        readonly aliases: Array<string>
    ) {
        super("PaperMaterial");
    }
    public static is(code: any): code is PaperMaterialEncoding {
        if (typeof code.name !== "string") return false;
        let aliases = code.aliases;
        if (!Array.isArray(aliases)) return false;
        for (const alias of aliases) {
            if (typeof alias !== "string") return false;
        }
        return true;
    }
    public static fromInstance(paperMaterial: Product.PaperMaterial): PaperMaterialEncoding {
        return new PaperMaterialEncoding(
            paperMaterial.name,
            paperMaterial.aliases
        )
    }
    public static toInstance(encoding: PaperMaterialEncoding): Product.PaperMaterial {
        return new Product.PaperMaterial(
            encoding.name,
            encoding.aliases
        )
    }
}

class CoatEncoding extends ConcreteClassEncoding {
    constructor (
        readonly name: string,
        readonly chineseName: string
    ) {
        super("Coat");
    }
    public static is(code: any): code is CoatEncoding {
        return (
            (typeof code.name === "string")
            && (typeof code.chineseName === "string")
        );
    }
    public static fromInstance(coat: Product.Coat): CoatEncoding {
        return new CoatEncoding(
            coat.name,
            coat.chineseName
        );
    }
    public static toInstance(encoding: CoatEncoding): Product.Coat {
        return new Product.Coat(
            encoding.name,
            encoding.chineseName
        );
    }
}

class SingleSheetEncoding extends ConcreteClassEncoding {
    className: ProductSubclassName = ProductSubclassName.SINGLE_SHEET;
    private constructor(
        public width: number,
        public height: number,
        public isDoubleSided: boolean,
        public paper: PaperEncoding,
        public frontSideCoat?: CoatEncoding,
        public backSideCoat?: CoatEncoding
    ) {
        super(ProductSubclassName.SINGLE_SHEET);
    }

    public static encode(singleSheet: Product.SingleSheet): string {
        let encoding: ProductEncoding = this.fromInstance(singleSheet);
        return this.toJson(encoding);
    }
    public static is(code: any): code is SingleSheetEncoding {
        if (typeof code.width !== "number") return false;
        if (typeof code.height !== "number") return false;
        if (typeof code.isDoubleSided !== "boolean") return false;
        if (!PaperEncoding.is(code.paperTexture)) return false;
        if ((typeof code.frontSideCoat !== "undefined")
            && !CoatEncoding.is(code.frontSideCoat)
        ) return false;
        if ((typeof code.backSideCoat !== "undefined")
            && !CoatEncoding.is(code.backSideCoat)
        ) return false;
        return true;
    }
    public static isInstance(object: any): object is Product.SingleSheet {
        return (object.constructor.name === ProductSubclassName.SINGLE_SHEET);
    } 
    public static fromInstance(product: Product.SingleSheet): ProductEncoding {
        let frontSideCoatEncoding: CoatEncoding | undefined;
        let backSideCoatEncoding: CoatEncoding | undefined;
        if (product.frontSideCoat) frontSideCoatEncoding = CoatEncoding.fromInstance(product.frontSideCoat)
        if (product.backSideCoat) backSideCoatEncoding = CoatEncoding.fromInstance(product.backSideCoat)
        let singleSheetEncoding = new SingleSheetEncoding(
            product.width,
            product.height,
            product.getIsDoubleSided(),
            PaperEncoding.fromInstance(product.paperTexture),
            frontSideCoatEncoding,
            backSideCoatEncoding
        );
        return ProductEncoding.fromSubclassEncoding(singleSheetEncoding);
    }
    public static toInstance(encoding: SingleSheetEncoding): Product.SingleSheet {
        return new Product.SingleSheet(
            encoding.width,
            encoding.height,
            encoding.isDoubleSided,
            encoding.paper,
            encoding.frontSideCoat,
            encoding.backSideCoat
        );
    }
}


export class ReviewItemEncoding extends ConcreteClassEncoding {
    constructor(
        readonly reviewId: string, 
        readonly numberOfModels: number, 
        readonly reviewSatusEncoding: ReviewStatusEncoding,
        readonly productEncoding: ProductEncoding,
        readonly reviewModelEncodings: Map<number, ReviewModelEncoding>
    ) {
        super('ReviewItem');
    }
    public static decode(text: string): Review.ReviewItem | null { 
        let code = this.fromJson(text);
        if (this.is(code)) {
            return this.toInstance(code);
        }
        return null;
    }

    public static toInstance(encoding: ReviewItemEncoding): Review.ReviewItem | null {
        let reviewId: string = encoding.reviewId;
        let numberOfModels: number = encoding.numberOfModels; 
        let reviewStatus: Review.ReviewStatus = ReviewStatusEncoding.toInstance(encoding.reviewSatusEncoding);
        let product: Product.Product = ProductEncoding.toInstance(encoding.productEncoding);

        let reviewItem = new Review.ReviewItem(
            reviewId,
            numberOfModels,
            reviewStatus,
            product
        );
        
        let models = new Map<number, Review.ReviewModel>();
        
        //TODO : 拿 reviewModelEncodings 給 reviewModelEncoding.toInstance ，對應得到 Map<string, reviewModel>           
        (encoding.reviewModelEncodings).forEach((encoding, index) => {
            let model = ReviewModelEncoding.toInstance(encoding, reviewItem);
            models.set(index, model);
        });
        
        reviewItem.setModels(models);   // TODO: throw an exception
        
        return reviewItem;
    }
    public static fromInstance(reviewItem: Review.ReviewItem): ReviewItemEncoding {
        let reviewModels = reviewItem.getModels();
        let reviewModelEncodings = new Map<number, ReviewModelEncoding>();
        reviewModels.forEach((model, modelIndex) => {
            reviewModelEncodings.set(
                modelIndex,
                ReviewModelEncoding.fromInstance(model)
            );
        })
        return new ReviewItemEncoding(
            reviewItem.reviewId,
            reviewItem.numberOfModels,
            ReviewStatusEncoding.fromInstance(reviewItem.status),
            ProductEncoding.fromInstance(reviewItem.product),
            reviewModelEncodings
        );
    }
    public static is(code: any): code is ReviewItemEncoding { 
        if (typeof code.reviewId !== 'string') return false;
        if (typeof code.numberOfModels !== 'number') return false;
        if (!ReviewStatusEncoding.is(code.ReviewSatus)) return false;
        if (!ProductEncoding.is(code.product)) return false;
        if (!Array.isArray(code.reviewedModelEncodings)) return false;
        
        let isReviewedModelEncodings = true;
        code.reviewedModelEncodings.forEach((element: any) => {
            if (!ReviewModelEncoding.is(element)) isReviewedModelEncodings = false;
        });
        if (!isReviewedModelEncodings) return false;
        return true;
    }
}


class ReviewStatusEncoding extends ClassEncoding {
    constructor(
        protected uploadFileEncodings: Array<UploadFileStatusEncoding>,
        protected progress: Review.ReviewingProgress
    ) {
        super('ReviewSatus',false);
    }

    toInstance(encoding: ReviewStatusEncoding): Review.ReviewStatus | null {
        let uploadFiles = [];
        let uploadFileEncodings = encoding.uploadFileEncodings;
        let lengthOfUploadFile: number = uploadFileEncodings.length;
        for (let i=0; i<lengthOfUploadFile; i++) {
           let uploadFile = UploadFileStatusEncoding.toInstance(uploadFileEncodings[i]);
        if (uploadFile) uploadFiles.push(uploadFile);
        }

        if (uploadFiles.length === uploadFileEncodings.length) {
            return new Review.ReviewStatus(
                uploadFiles,
                this.progress  
            )
        } else {
            return null;
        }
    }

    public static is(code: any): code is ReviewStatusEncoding { 
        if (!Object.values(Review.ReviewingProgress).includes(code.progress)) return false;
        if (!code.uploadFileEncodings) return false;
        let isUploadFileEncodings = true;
        code.uploadFileEncodings.forEach((element: any)=> {
            if (!UploadFileStatusEncoding.is(element)) isUploadFileEncodings = false;
        });
        if (!isUploadFileEncodings) return false;

        return true;
    }
}

class UploadFileStatusEncoding extends ClassEncoding {
    constructor(
        readonly fileName: string,        
        protected currentStage: Review.UploadFileProcessingStage,
        protected hasError: boolean = false,
        protected numberOfPages?: number,
        protected fileAddress?: string,
        protected previewPagesAddress?: Array<string>,
        protected printablePagesAddress?: Array<string>,
        protected errorStage?: Review.UploadFileProcessingStage
    ) 
    {
        super('UploadFile',false);
    }

    public static toInstance(encoding: UploadFileStatusEncoding): Review.UploadFileStatus | null{
      return new Review.UploadFileStatus (
        encoding.fileName,        
        encoding.currentStage,
        encoding.numberOfPages,
        encoding.fileAddress,
        encoding.previewPagesAddress,
        encoding.printablePagesAddress,
        encoding.errorStage
      );
    }
    public static fromInstance(): UploadFileStatusEncoding {

    }
    public static is(code: any): code is UploadFileStatusEncoding { 
        if (typeof code.className !== 'string') return false;
        if (typeof code.hasError !== 'boolean') return false;
        if (code.numberOfPages && typeof code.numberOfPages !== 'number') return false;
        if (code.fileAddress && typeof code.fileAddress !== 'string') return false;
        
        if (!Array.isArray(code.previewPagesAddress)) return false;
        for (const Address of code.previewPagesAddress) {
            if (typeof Address !== "string") return false;
        }

        if (!Array.isArray(code.printablePagesAddress)) return false;
        for (const Address of code.printablePagesAddress) {
            if (typeof Address !== "string") return false;
        }

        if (!Object.values(Review.UploadFileProcessingStage).includes(code.currentStage)) return false;
        if (code.errorStage && !Object.values(Review.UploadFileProcessingStage).includes(code.errorStage)) return false;

        return true;
    }
}

class ReviewModelEncoding extends ConcreteClassEncoding {
    constructor(
        public readonly modelIndexInReviewItem: number,
        public readonly framedPageEncodings: Map<string, FramedPageEncoding>
    ) {
        super('ReviewModel');
    }

    public static toInstance(encoding: ReviewModelEncoding, reviewItem: Review.ReviewItem): Review.ReviewModel {
        let reviewModel = new Review.ReviewModel(
            encoding.modelIndexInReviewItem,
            reviewItem
        );
        let framedPageEncodings = encoding.framedPageEncodings;
        let framedPages = new Map<string, Review.FramedPage>();
        framedPageEncodings.forEach((framedPageEncoding, frameIndex) => {
            framedPages.set(
                frameIndex,
                FramedPageEncoding.toInstance(
                    framedPageEncoding,
                    reviewModel
                )
            );
        });
        reviewModel.setFramedPages(framedPages);
        return reviewModel;
    }
    public static fromInstance(reviewModel: Review.ReviewModel): ReviewModelEncoding {
        let framedPages = reviewModel.getFramedPages();
        let framedPageEncodings = new Map<string, FramedPageEncoding>();
        framedPages.forEach((framedPage, frameIndex) => {
            framedPageEncodings.set(
                frameIndex,
                FramedPageEncoding.fromInstance(framedPage)
            )
        });
        return new ReviewModelEncoding(
            reviewModel.modelIndexInReviewItem,
            framedPageEncodings
        );
    }

    public static is(code: any): code is ReviewModelEncoding { 
        
    }
}

class FramedPageEncoding extends ConcreteClassEncoding {
    public static toInstance(encoding: FramedPageEncoding, reviewModel: Review.ReviewModel): Review.FramedPage {

    }
    public static fromInstance(framedPage: Review.FramedPage): FramedPageEncoding {

    }
}