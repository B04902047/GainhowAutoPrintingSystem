
import { Expose } from "class-transformer";
import { UploadFileProcessingStage, UploadFileStatus as UploadFileStatusInterface } from "../Interface";

export default class UploadFileStatus implements UploadFileStatusInterface {

    constructor (
        readonly fileName: string,
        readonly fileId: string,
        public currentStage: UploadFileProcessingStage,
        public numberOfPages?: number,
        public fileAddress?: string,
        public previewPagesAddress?: Array<string>,
        public printablePagesAddress?: Array<string>,
        public errorStage?: UploadFileProcessingStage
    ) {}

    @Expose()
    public get hasError(): boolean {
        if (this.errorStage) return true;
        return false;
    }
}
