import BleededRectangleFrame from "./BleededRectangleFrame";
import Line from "./Line";

export default abstract class BookCoverFrame extends BleededRectangleFrame {
    protected abstract createFoldLines(): Line[];
}