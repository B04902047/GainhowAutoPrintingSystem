import ReviewItem from "./ReviewItem";
import ReviewRegistrationInfo from "./ReviewRegistrationInfo";
import ReviewStatus from "./ReviewStatus";

export default abstract class ReviewReception {
    abstract register(reviewRegistrationInfo: ReviewRegistrationInfo): Promise<ReviewStatus>;
    abstract deregister(reviewId: string): Promise<void>;
    abstract uploadFiles(reviewId: string, numberOfFiles: number, files: Array<File>): Promise<ReviewStatus>;
    abstract deleteFile(reviewId: string, fileId: string): Promise<ReviewStatus>;
    abstract loadReviewStatus(reviewId: string): Promise<ReviewStatus>;
    abstract loadReviewItem(reviewId: string): Promise<ReviewItem>;
    abstract saveReviewItem(reviewItem: ReviewItem): Promise<ReviewItem>;
    abstract generateFinalResults(reviewItem: ReviewItem): Promise<void>;
}
