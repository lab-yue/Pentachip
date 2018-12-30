import DefaultBoard from './map'
import * as PentachipType from "./type";

export default class Pentachip {
    public turn: PentachipType.PlayerIndex;
    public config: PentachipType.GameConfig;
    private ctx: CanvasRenderingContext2D;
    public board: PentachipType.Board;
    public state: PentachipType.BoardState;
    private moving: PentachipType.GameChipInterface;

    constructor(canvas: HTMLCanvasElement) {
        canvas.height = 600;
        canvas.width = 600;
        this.ctx = canvas.getContext('2d');
        this.config = {
            COLOR: {
                P1: "black",
                P2: "red"
            },
            LATTICE: {
                SIZE: 100
            },
            GAME_CHIP: {
                RADIUS: 20,
                SPEED: 0.01,
            }
        }
        this.board = new DefaultBoard(this.config, this.ctx);
        this.state = this.board.load();
    }

    public start(startBy: PentachipType.PlayerIndex) {

        this.turn = startBy;
        this.board.draw();
        this.state.chips.forEach(
            chip => this.drawChip(chip)
        )
    }

    public drawChip(chip: PentachipType.GameChipInterface) {

        this.ctx.beginPath();
        this.ctx.arc(
            chip.position.x * this.config.LATTICE.SIZE,
            chip.position.y * this.config.LATTICE.SIZE,
            this.config.GAME_CHIP.RADIUS,
            0, 2 * Math.PI, false
        );
        this.ctx.fillStyle = this.config.COLOR[chip.ownedBy];
        this.ctx.fill();
    }

    public move(chip: PentachipType.GameChipInterface) {
        this.moving = chip;
        return this
    }

    public to(newPosition: PentachipType.GameChipPosition) {
        console.log(newPosition);
        let done = true;

        if (this.moving.position.x !== newPosition.x) {
            done = false;
            this.moving.position.x += this.config.GAME_CHIP.SPEED
            this.moving.position.x = parseFloat(this.moving.position.x.toFixed(2))
        }

        if (this.moving.position.y !== newPosition.y) {
            done = false;
            this.moving.position.y += this.config.GAME_CHIP.SPEED

            this.moving.position.y = parseFloat(this.moving.position.y.toFixed(2))
        }

        if (!done) {
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.drawChip(this.moving)
            this.board.draw();
            this.state.chips.forEach(
                chip => this.drawChip(chip)
            )
            requestAnimationFrame(() => this.to(newPosition));
        }
        return this;
    }
}
