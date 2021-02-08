import { deserialize, serialize, Type } from "class-transformer";
import { ReviewingProgress, ReviewStatus as ReviewStatusInterface } from "../Interface";
import UploadFileStatus from "./UploadFileStatus";

export default class ReviewStatus implements ReviewStatusInterface {

    @Type(() => UploadFileStatus)
    public uploadFileStatuses: Array<UploadFileStatus>;

    // TODO: enum? string literal? serializable?
    public progress: ReviewingProgress;
    constructor (
        public reviewId: string,
        public numberOfModels: number,
        public modelIds: string[],
        public numberOfFiles: number,
        uploadFileStatuses: Array<UploadFileStatus>,
        progress: ReviewingProgress
    ) {
        this.uploadFileStatuses = uploadFileStatuses;
        this.progress = progress;
    }
    public toJson(status: ReviewStatus): string {
        return serialize(status);
    }
    public fromJson(text: string): ReviewStatus {
        return deserialize(ReviewStatus, text);
    }
}