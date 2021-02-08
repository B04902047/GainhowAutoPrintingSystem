import Frame from "./Frame";

export default abstract class RectangleFrame extends Frame {
    constructor(
        protected width: number,
        protected height: number
    ) {
        super(width, height);
    }
}