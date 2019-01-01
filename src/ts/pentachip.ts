import common from "./common";
import config from "./config";
import GameChip from "./gamechip";
import DefaultBoard from "./map";
import Renderable from "./renderable";
import * as p from "./type";

export default class Pentachip extends Renderable {
    public turn: p.PlayerIndex;
    public config: p.GameConfig;
    public board: p.BoardInterface;
    public state: p.BoardState;
    private moving: p.GameChipInterface;
    private hints: p.GameChipInterface[];

    constructor() {
        super();
        this._canvas.height = 600;
        this._canvas.width = 600;
        this.config = config;
        this.board = new DefaultBoard();
        this.state = this.board.load();
        this.hints = [];
        this._canvas.onmousemove = (e) => {
            const hoverPosition = this.getEventPositon(e);
            let hoveringSome = false;
            this.state.chips.map(
                (chip) => {
                    const hover = this.isInside(chip.position, hoverPosition);
                    chip.hover = hover;
                    if (hover) {
                        hoveringSome = true;
                    }
                },
            );
            if (hoveringSome) {
                this.render();
            }
        };

        this._canvas.onclick = (e) => {
            const clickPositon = this.getEventPositon(e);
            let selectedSome = false;
            this.state.chips.map(
                (chip) => {

                    const selected = this.isInside(chip.position, clickPositon);

                    if (selected) {
                        selectedSome = true;
                        this.hints = [];
                        this.searchHintPoints(chip.position).map(
                            (hint) => this.hints.push(new GameChip(hint, "GAME")),
                        );
                    }

                    chip.selected = selected;
                },
            );
            if (selectedSome) {
                this.render();
            }
        };
    }

    public render() {
        this._ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.board.render();
        this.renderChips();
        this.renderHints();
    }

    public getEventPositon(e: MouseEvent): p.GameChipPosition {

        const rect = this._canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    public start(startBy: p.PlayerIndex) {
        this.turn = startBy;
        this.render();
    }

    public renderChips() {
        this.state.chips.map(
            (chip) => chip.render(),
        );
    }

    public renderHints() {
        this.hints.map(
            (hint) => hint.render(),
        );
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
                        this.render();
                        requestAnimationFrame(loop);
                    } else {
                        resolve();
                    }
                };
                loop();
            },
        );
    }

    private searchHintPoints(selected: p.GameChipPosition): p.GameChipPosition[] {

        const positionString = common.PositionToSting(selected);
        const directions = this.board.directionMap[positionString];
        let hintPointList: p.GameChipPosition[] = [];
        directions.forEach((direction) => {
            hintPointList = hintPointList.concat(
                this.searchDirectionHintPoints(selected, direction),
            );
        });

        return hintPointList;
    }

    private checkInclude(positionList: p.GameChipPosition[], testPoint: p.GameChipPosition): boolean {

        const occupied = positionList.filter(
            (point) => {
                return point.x === testPoint.x
                    && point.y === testPoint.y;
            },
        );
        return Boolean(occupied.length);
    }

    private searchDirectionHintPoints(selected: p.GameChipPosition, direction: p.Direction): p.GameChipPosition[] {
        const hintPointList: p.GameChipPosition[] = [];
        switch (direction) {

            case p.Direction.Top: {
                const start = selected.y - 1;
                for (let i = start; i >= 1; i--) {

                    const testPoint = { x: selected.x, y: i };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.Down: {
                const start = selected.y + 1;
                for (let i = start; i <= 5; i++) {
                    const testPoint = { x: selected.x, y: i };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.Left: {
                const start = selected.x - 1;
                for (let i = start; i >= 1; i--) {
                    const testPoint = { x: i, y: selected.y };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.Right: {
                for (let i = selected.x + 1; i <= 5; i++) {
                    const testPoint = { x: i, y: selected.y };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.TopLeft: {
                for (let i = selected.x - 1; i >= 1; i--) {
                    const testPoint = { x: i, y: i };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.TopRight: {
                for (let i = selected.x + 1; i <= 5; i++) {
                    const testPoint = { x: i, y: 1 + selected.y - i };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.DownLeft: {
                for (let i = selected.x - 1; i >= 1; i--) {
                    const testPoint = { x: i, y: 1 + selected.y - i };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

            case p.Direction.DownRight: {
                for (let i = selected.x + 1; i <= 5; i++) {
                    const testPoint = { x: i, y: i };
                    const occupied = this.checkInclude(
                        this.state.chips.map((chip) => chip.position),
                        testPoint,
                    );
                    if (occupied) {
                        break;
                    } else {
                        const inMap = this.checkInclude(this.state.map, testPoint);
                        if (inMap) {
                            hintPointList.push(testPoint);
                        }
                    }
                }
                return hintPointList;
            }

        }
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
