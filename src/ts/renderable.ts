import config from "./config";
import * as type from "./type";

export default abstract class Renderable {

    public _canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
    public _ctx: CanvasRenderingContext2D = this._canvas.getContext("2d");
    public _config: type.GameConfig = config;

    public abstract render(): void;
}
