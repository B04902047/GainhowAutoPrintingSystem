
import * as Interfaces from "./Interface";


export class TransactionError extends Error implements Interfaces.TransactionError {
    constructor(
        readonly failureType: Interfaces.FailureType,
        message?: string
    ) {
        super(message);
    }
}