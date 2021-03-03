
import { FailureType, TransactionError as TransactionErrorInterface } from "./Interface";

export class TransactionError extends Error implements TransactionErrorInterface {
    constructor(
        readonly failureType: FailureType,
        message?: string
    ) {
        super(message);
    }
}

enum LogLevel {
    Emergency = 0,     // 系統無法使⽤。
    Alert = 1,         // 必須立刻採取對應⾏動。
    Critical = 2,      //⼀定嚴重程度的錯誤。
    Error = 3,         // ⼀般程式錯誤。
    Warning = 4,       // 無錯誤，但有異常跡象的預先警告。
    Notice = 5,        // 可預期但必須注意的。
    Informational = 6, // 常⾒資訊。
    Debug = 7,         // 除錯⽤訊息。
}

interface Log {
	dateTime: Date;
    message?: string;
    level: LogLevel;
	code: number;
	filePath: string;
	lineNumber?: number;
	stackTrace?: string;
}