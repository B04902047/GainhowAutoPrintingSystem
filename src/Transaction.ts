
export enum FailureType {
    CONNECTION_FAILURE = "連線錯誤",
    PRECONDITION_FAILURE = "前置條件不符",
    POSTCONDITION_FAILURE = "後置條件無法完成",
    UNDEFINED_FAILURE = "未能歸類為以上三種"
}

export class TransactionError extends Error {
    constructor(failureType: FailureType, message?: string) {
        super(message);
    }
}

class TransactionResponse<T> {
    isFinished: boolean;
    error?: TransactionError;
    data: T;
}