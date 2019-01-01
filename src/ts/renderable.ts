import config from "./config";
import * as type from "./type";

export default abstract class Renderable {

    public _canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
    public _ctx: CanvasRenderingContext2D;
    public _config: type.GameConfig;

    constructor() {
       // this._canvas = document.getElementById("game") as HTMLCanvasElement;
        this._ctx = this._canvas.getContext("2d");
        this._config = config;
    }

    public abstract render(): void;
}
