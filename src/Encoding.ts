import * as Product from "./Product";

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

class ProductEncoding extends AbstractClassEncoding {
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
        switch (code.subclassName) {
            case ProductSubclassName.BOOK:
                return BookEncoding.is(code.subclassEncoding);
            case ProductSubclassName.SINGLE_SHEET:
                return SingleSheetEncoding.is(code.subclassEncoding);
            default:
                return false;
        }
    }
    public static decode(json: string): Product.Product | null {
        let productEncoding: any | null = this.fromJson(json);
        if (productEncoding === null) return null;
        return this.toInstance(productEncoding);        
    }
    public static fromSubclassEncoding(subclassEncoding: ProductSubclassEncoding): ProductEncoding {
        return new ProductEncoding(
            subclassEncoding.className,
            subclassEncoding
        );
    }
    public static toInstance(encoding: ProductEncoding): Product.Product | null {
        if (!this.is(encoding)) return null;
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
    constructor (
        readonly subclassName: BookSubclassName,
        readonly subclassEncoding: BookSubclassEncoding
    ) {
        super(
            ProductSubclassName.BOOK,
            subclassName,
            subclassEncoding
        )
    }
    public static is(code: any): code is BookEncoding {
        if (code.className !== ProductSubclassName.BOOK) return false;
        switch (code.subclassName) {
            case BookSubclassName.BUTTERFLY_BINDING_BOOK:
            case BookSubclassName.PERFECT_BINDING_BOOK:
            case BookSubclassName.SADDLE_STICH_BINDING_BOOK:
                break;
            default: return false;
        }
        if (!AbstractClassEncoding.is(code)) return false;
        return true;
    }
    public static toInstance(encoding: BookEncoding): Product.Book | null {
        let subclassEncoding: BookSubclassEncoding = encoding.subclassEncoding;
        switch (encoding.subclassName) {
            case BookSubclassName.SADDLE_STICH_BINDING_BOOK:
                if (SaddleStichBindingBookEncoding.is(subclassEncoding)) {
                    return SaddleStichBindingBookEncoding.toInstance(subclassEncoding);
                }
            case BookSubclassName.PERFECT_BINDING_BOOK:
                if (PerfectBindingBookEncoding.is(subclassEncoding)) {
                    return PerfectBindingBookEncoding.toInstance(subclassEncoding);
                }
            case BookSubclassName.BUTTERFLY_BINDING_BOOK:
                if (ButterflyBindingBookEncoding.is(subclassEncoding)) {
                    return ButterflyBindingBookEncoding.toInstance(subclassEncoding as ButterflyBindingBookEncoding);    
                }
            }
        return null;
    }
    public static fromSubclassEncoding(subclassEncoding: BookSubclassEncoding): ProductEncoding {
        let bookEncoding = new BookEncoding(
            subclassEncoding.className,
            subclassEncoding
        );
        return ProductEncoding.fromSubclassEncoding(bookEncoding);
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
    public static toInstance(encoding: SaddleStichBindingBookEncoding): Product.SaddleStichBindingBook | null {
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
        super("SingleSheet");
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