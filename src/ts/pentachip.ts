import config from "./config";
import DefaultBoard from "./map";
import * as p from "./type";
import common from "./common";
import GameChip from './gamechip'
export default class Pentachip {
    public turn: p.PlayerIndex;
    public config: p.GameConfig;
    public board: p.Board;
    public state: p.BoardState;
    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private moving: p.GameChipInterface;
    private hints: p.GameChipInterface[]

    constructor(canvas: HTMLCanvasElement) {
        canvas.height = 600;
        canvas.width = 600;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.config = config;
        this.board = new DefaultBoard(this.config, this.ctx);
        this.state = this.board.load();
        this.hints = [];
        canvas.onmousemove = (e) => {
            const hoverPosition = this.getEventPositon(e);
            this.board.redraw();

            this.state.chips.map(
                (chip) => {
                    chip.hover = this.isInside(chip.position, hoverPosition);
                    this.drawChip(chip);
                },
            );
            this.drawHints()
        };

        canvas.onclick = (e) => {
            const ClickPositon = this.getEventPositon(e);
            let selectedSome = false;
            this.state.chips.map(
                (chip) => {

                    const selected = this.isInside(chip.position, ClickPositon);

                    if (selected) {
                        selectedSome = true;
                        this.hints = []
                        this.searchHintPoints(chip.position).map(
                            hint => this.hints.push(new GameChip(hint, "GAME"))
                        )
                    }

                    chip.selected = selected;
                }
            );

            if (selectedSome) {
                this.board.redraw();
                this.drawChips();
                this.drawHints();
            }
        };
    }

    public getEventPositon(e: MouseEvent): p.GameChipPosition {

        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    public start(startBy: p.PlayerIndex) {

        this.turn = startBy;
        this.board.draw();
        this.state.chips.forEach(
            (chip) => this.drawChip(chip),
        );
    }

    public drawChip(chip: p.GameChipInterface) {

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
            : "black";

        this.ctx.stroke();

    }

    public drawChips() {
        this.state.chips.map(
            chip => this.drawChip(chip)
        )
    }

    public drawHints() {
        this.hints.map(
            hint => this.drawChip(hint)
        )
    }

    private searchHintPoints(selected: p.GameChipPosition): p.GameChipPosition[] {

        const positionString = common.PositionToSting(selected);
        const directions = this.board.directionMap[positionString];
        let hintPointList: p.GameChipPosition[] = [];
        directions.forEach(direction => {
            hintPointList = hintPointList.concat(
                this.searchDirectionHintPoints(selected, direction)
            )
        })

        return hintPointList
    }

    private checkInclude(positionList: p.GameChipPosition[], testPoint: p.GameChipPosition): boolean {

        const occupied = positionList.filter(
            point => {
                return point.x === testPoint.x
                    && point.y === testPoint.y
            }
        )
        return Boolean(occupied.length)
    }

    private searchDirectionHintPoints(selected: p.GameChipPosition, direction: p.Direction): p.GameChipPosition[] {
        const hintPointList: p.GameChipPosition[] = [];
        switch (direction) {

            case p.Direction.Top: {
                let start = selected.y - 1;
                for (let i = start; i >= 1; i--) {

                    let testPoint = { x: selected.x, y: i }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

            case p.Direction.Down: {
                let start = selected.y + 1;
                for (let i = start; i <= 5; i++) {
                    let testPoint = { x: selected.x, y: i }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

            case p.Direction.Left: {
                let start = selected.x - 1;
                for (let i = start; i >= 1; i--) {
                    let testPoint = { x: i, y: selected.y }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

            case p.Direction.Right: {
                for (let i = selected.x + 1; i <= 5; i++) {
                    let testPoint = { x: i, y: selected.y }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }


            case p.Direction.TopLeft: {
                for (let i = selected.x - 1; i >= 1; i--) {
                    let testPoint = { x: i, y: i }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

            case p.Direction.TopRight: {
                for (let i = selected.x + 1; i <= 5; i++) {
                    let testPoint = { x: i, y: 1 + selected.y - i }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

            case p.Direction.DownLeft: {
                for (let i = selected.x - 1; i >= 1; i--) {
                    let testPoint = { x: i, y: 1 + selected.y - i }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

            case p.Direction.DownRight: {
                for (let i = selected.x + 1; i <= 5; i++) {
                    let testPoint = { x: i, y: i }
                    const occupied = this.checkInclude(
                        this.state.chips.map(chip => chip.position),
                        testPoint
                    )
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint)
                        inMap
                            ? hintPointList.push(testPoint)
                            : null
                    }
                }
                return hintPointList
            }

        }
    }


    public move(chipOrId: p.GameChipInterface | string) {
        let movingChip: p.GameChipInterface;

        if (typeof chipOrId === "string") {

            const chipList = this.state.chips.filter((chip) => chip.id === chipOrId);
            chipList.length === 1
                ? movingChip = chipList[0]
                : Error("ID not found");

        } else {
            movingChip = chipOrId;
        }

        this.moving = movingChip;
        return this;
    }

    public to(newPosition: p.GameChipPosition) {

        return new Promise(
            (resolve, reject) => {
                //                console.log(newPosition);

                const distence: p.GameChipPosition = {
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
                        this.drawChips()
                        this.drawHints()
                        requestAnimationFrame(loop);
                    } else {
                        resolve();
                    }
                };
                loop();
            },
        );
    }

    private isInside(
        point1: p.GameChipPosition,
        point2: p.GameChipPosition) {
        const distence = Math.sqrt(
            Math.abs(point1.x * this.config.LATTICE.SIZE - point2.x) ** 2 +
            Math.abs(point1.y * this.config.LATTICE.SIZE - point2.y) ** 2);
        const hover = distence < this.config.GAME_CHIP.RADIUS;
        return hover;
    }
}
