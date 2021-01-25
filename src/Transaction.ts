
import * as Interfaces from "./Interfaces";


export class TransactionError extends Error implements Interfaces.TransactionErrorInterface {
    constructor(
        readonly failureType: Interfaces.FailureType,
        message?: string
    ) {
        super(message);
    }
}