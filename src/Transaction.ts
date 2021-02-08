
import { FailureType, TransactionError as TransactionErrorInterface } from "./Interface";

export class TransactionError extends Error implements TransactionErrorInterface {
    constructor(
        readonly failureType: FailureType,
        message?: string
    ) {
        super(message);
    }
}