import * as Product from "./Product";

abstract class ClassEncoding {
    className: string;
    isAbstract: boolean;
    public static toJson(code: ClassEncoding): string {
        return JSON.stringify(code);
    }
    public static fromJson(json: string): ClassEncoding | null {
        let code: any;
        try {
            code = JSON.parse(json);
        } catch {
            return null;
        }
        if (!this.is(code)) return null;
        return code;
    }
    public static is(code: any): code is ClassEncoding {
        if (!code.className) return false;
        if (!(code.isAbstract === true || code.isAbstract === false)) return false;
        return true;
    }
}

abstract class ConcreteClassEncoding extends ClassEncoding {
    isAbstract: false = false;
    subclassName?: string;
    subclassEncoding?: ConcreteClassEncoding;
}

class AbstractClassEncoding extends ClassEncoding {
    readonly isAbstract: true = true;
    subclassName: string;
    subclassEncoding: ClassEncoding;
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
    readonly className: "Product" = "Product";
    subclassName: ProductSubclassName;
    subclassEncoding: ProductSubclassEncoding;

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
    public static encode(subclassEncoding: ProductSubclassEncoding): ProductEncoding {
        return {
            className: "Product",
            isAbstract: true,
            subclassName: subclassEncoding.className,
            subclassEncoding
        };
    }
    public static decode(encoding: ProductEncoding): Product.Product {
        switch (encoding.subclassName) {
            case ProductSubclassName.BOOK:
                return BookEncoding.decode(encoding.subclassEncoding as BookEncoding);
            case ProductSubclassName.SINGLE_SHEET:
                return SingleSheetEncoding.decode(encoding.subclassEncoding as SingleSheetEncoding);
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
    className: ProductSubclassName = ProductSubclassName.BOOK;
    subclassName: BookSubclassName;
    subclassEncoding: BookSubclassEncoding;
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
    }
    public static decode(encoding: BookEncoding): Product.Book | null {
        let subclassEncoding: BookSubclassEncoding = encoding.subclassEncoding;
        switch (encoding.subclassName) {
            case BookSubclassName.SADDLE_STICH_BINDING_BOOK:
                if (SaddleStichBindingBookEncoding.is(subclassEncoding)) {
                    return SaddleStichBindingBookEncoding.decode(subclassEncoding);
                }
            case BookSubclassName.PERFECT_BINDING_BOOK:
                if (PerfectBindingBookEncoding.is(subclassEncoding)) {
                    return PerfectBindingBookEncoding.decode(subclassEncoding);
                }
            case BookSubclassName.BUTTERFLY_BINDING_BOOK:
                if (ButterflyBindingBookEncoding.is(subclassEncoding)) {
                    return ButterflyBindingBookEncoding.decode(subclassEncoding as ButterflyBindingBookEncoding);    
                }
            }
        return null;
    }
    public static encode(subclassEncoding: BookSubclassEncoding): BookEncoding {
        return {
            className: ProductSubclassName.BOOK,
            isAbstract: true,
            subclassName: subclassEncoding.className,
            subclassEncoding
        };
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
        super();
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
    public static decode(encoding: SaddleStichBindingBookEncoding): Product.SaddleStichBindingBook | null {
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
    public static encode(product: Product.SaddleStichBindingBook): SaddleStichBindingBookEncoding {
        return new SaddleStichBindingBookEncoding(
            product.coverWidth,
            product.coverHeight, 
            product.numberOfPages, 
            product.coverPaperTexture,
            product.innerPagesPaperTexture, 
            product.coverCoating, 
            product.innerPageCoating
        ); 
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
        super();
    }
    public static is(code: any): code is PaperEncoding {
        if (!PaperMaterialEncoding.is(code.material)) return false;
        if (typeof code.thickness !== "number") return false;
        if (typeof code.isSmooth !== "boolean") return false;
        if (typeof code.description !== "string") return false;
        return true;
    }
    public static encode(paper: Product.Paper): PaperEncoding {
        return new PaperEncoding(
            paper.material,
            paper.thickness,
            paper.isSmooth,
            paper.description
        );
    }
    public static decode(encoding: PaperEncoding): Product.Paper {
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
        super();
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
    public static encode(paperMaterial: Product.PaperMaterial): PaperMaterialEncoding {
        return new PaperMaterialEncoding(
            paperMaterial.name,
            paperMaterial.aliases
        )
    }
    public static decode(encoding: PaperMaterialEncoding): Product.PaperMaterial {
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
        super();
    }
    public static is(code: any): code is CoatEncoding {
        return (
            (typeof code.name === "string")
            && (typeof code.chineseName === "string")
        );
    }
    public static encode(coat: Product.Coat): CoatEncoding {
        return new CoatEncoding(
            coat.name,
            coat.chineseName
        );
    }
    public static decode(encoding: CoatEncoding): Product.Coat {
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
        public paperTexture: Product.Paper,
        public frontSideCoat?: Product.Coat,
        public backSideCoat?: Product.Coat
    ) {
        super();
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
    public static encode(product: Product.SingleSheet): SingleSheetEncoding {
        return new SingleSheetEncoding(
            product.width,
            product.height,
            product.getIsDoubleSided(),
            product.paperTexture,
            product.frontSideCoat,
            product.backSideCoat
        );
    }
    public static decode(encoding: SingleSheetEncoding): Product.SingleSheet {
        return new Product.SingleSheet(
            encoding.width,
            encoding.height,
            encoding.isDoubleSided,
            encoding.paperTexture,
            encoding.frontSideCoat,
            encoding.backSideCoat
        );
    }
}