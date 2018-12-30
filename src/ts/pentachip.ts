import config from './config'
import DefaultBoard from "./map";
import * as PentachipType from "./type";

export default class Pentachip {
    public turn: PentachipType.PlayerIndex;
    public config: PentachipType.GameConfig;
    public board: PentachipType.Board;
    public state: PentachipType.BoardState;
    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private moving: PentachipType.GameChipInterface;

    constructor(canvas: HTMLCanvasElement) {
        canvas.height = 600;
        canvas.width = 600;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.config = config;
        this.board = new DefaultBoard(this.config, this.ctx);
        this.state = this.board.load();

        canvas.onmousemove = e => {

            const hoverPosition = this.getEventPositon(e);
            this.board.redraw();
            this.state.chips.map(
                chip => {
                    chip.hover = this.isInside(chip.position, hoverPosition);
                    this.drawChip(chip);
                },
            );
        };

        canvas.onclick = e => {
            const ClickPositon = this.getEventPositon(e);
            this.board.redraw();
            this.state.chips.map(
                chip => {
                    chip.selected = this.isInside(chip.position, ClickPositon);
                    this.drawChip(chip);
                },
            );
        }
    }

    public getEventPositon(e: MouseEvent): PentachipType.GameChipPosition {

        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    private isInside(
        point1: PentachipType.GameChipPosition,
        point2: PentachipType.GameChipPosition) {
        const distence = Math.sqrt(
            Math.abs(point1.x * this.config.LATTICE.SIZE - point2.x) ** 2 +
            Math.abs(point1.y * this.config.LATTICE.SIZE - point2.y) ** 2);
        const hover = distence < this.config.GAME_CHIP.RADIUS;
        return hover;
    }

    public start(startBy: PentachipType.PlayerIndex) {

        this.turn = startBy;
        this.board.draw();
        this.state.chips.forEach(
            (chip) => this.drawChip(chip),
        );
    }

    public drawChip(chip: PentachipType.GameChipInterface) {

        this.ctx.beginPath();
        this.ctx.arc(
            chip.position.x * this.config.LATTICE.SIZE,
            chip.position.y * this.config.LATTICE.SIZE,
            this.config.GAME_CHIP.RADIUS,
            0, 2 * Math.PI, false,
        );
        this.ctx.shadowBlur = 5;

        this.ctx.shadowColor = chip.hover
            ? this.config.COLOR.SHADOW
            : "rgba(0,0,0,0)";

        this.ctx.fillStyle = this.config.COLOR[chip.ownedBy];

        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.lineWidth = 4;

        this.ctx.strokeStyle = chip.selected
            ? "crimson"
            : 'black';

        this.ctx.stroke();

    }

    public move(chipOrId: PentachipType.GameChipInterface | string) {
        let chip: PentachipType.GameChipInterface;

        if (typeof chipOrId === "string") {
            
            const chipList = this.state.chips.filter(chip => chip.id === chipOrId)
            chipList.length === 1
                ? chip = chipList[0]
                : Error("ID not found")

        } else {
            chip = chipOrId
        }

        this.moving = chip;
        return this;
    }

    public to(newPosition: PentachipType.GameChipPosition) {

        return new Promise(
            (resolve, reject) => {
                console.log(newPosition);

                const distence: PentachipType.GameChipPosition = {
                    x: newPosition.x - this.moving.position.x,
                    y: newPosition.y - this.moving.position.y,
                };

                const loop = () => {
                    let done = true;

                    if (this.moving.position.x !== newPosition.x) {
                        done = false;
                        this.moving.position.x += distence.x / 100;
                        this.moving.position.x = parseFloat(this.moving.position.x.toFixed(2));
                    }

                    if (this.moving.position.y !== newPosition.y) {
                        done = false;
                        this.moving.position.y += distence.y / 100;

                        this.moving.position.y = parseFloat(this.moving.position.y.toFixed(2));
                    }

                    if (!done) {
                        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                        this.drawChip(this.moving);
                        this.board.draw();
                        this.state.chips.forEach(
                            (chip) => this.drawChip(chip),
                        );
                        requestAnimationFrame(loop);
                    } else {
                        resolve();
                    }
                };
                loop();
            },
        );
    }
}
