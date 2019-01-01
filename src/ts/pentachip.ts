import common from "./common";
import config from "./config";
import GameChip from "./gamechip";
import DefaultBoard from "./map";
import Renderable from "./renderable";
import * as type from "./type";

export default class Pentachip extends Renderable {
    public turn: type.PlayerIndex;
    public config: type.GameConfig;
    public board: type.BoardInterface;
    public state: type.BoardState;
    private selected: type.GameChipInterface;
    private hints: type.GameChipInterface[];

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

            if (this.selected && !Boolean(this.hints.length)) {
                return
            }

            const clickPositon = this.getEventPositon(e);
            let selectedSome = false;

            this.state.chips.map(
                (chip) => {
                    const selected = this.isInside(chip.position, clickPositon);
                    if (selected) {
                        selectedSome = true;
                        this.selected = chip;
                        this.hints = [];
                        this.searchHintPoints(chip.position).map(
                            (hint) => this.hints.push(new GameChip(hint, "GAME")),
                        );
                    }
                    chip.selected = selected;
                },
            );

            this.hints.map(
                (hint) => {
                    const clicked = this.isInside(hint.position, clickPositon);
                    if (clicked) {
                        this.hints = [];
                        this.to(hint.position);
                    }
                    return;
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

    public getEventPositon(e: MouseEvent): type.GameChipPosition {

        const rect = this._canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    public start(startBy: type.PlayerIndex) {
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

    public move(chipOrId: type.GameChipInterface | string) {
        let movingChip: type.GameChipInterface;

        if (typeof chipOrId === "string") {

            const chipList = this.state.chips.filter((chip) => chip.id === chipOrId);
            chipList.length === 1
                ? movingChip = chipList[0]
                : Error("ID not found");

        } else {
            movingChip = chipOrId;
        }

        this.selected = movingChip;
        return this;
    }

    public to(newPosition: type.GameChipPosition) {

        return new Promise(
            (resolve, reject) => {
                // console.log(newPosition);

                const distence: type.GameChipPosition = {
                    x: newPosition.x - this.selected.position.x,
                    y: newPosition.y - this.selected.position.y,
                };

                const loop = () => {
                    let done = true;

                    if (this.selected.position.x !== newPosition.x) {
                        done = false;
                        this.selected.position.x += distence.x / 100;
                        this.selected.position.x = parseFloat(this.selected.position.x.toFixed(2));
                    }

                    if (this.selected.position.y !== newPosition.y) {
                        done = false;
                        this.selected.position.y += distence.y / 100;

                        this.selected.position.y = parseFloat(this.selected.position.y.toFixed(2));
                    }

                    if (!done) {
                        this.render();
                        requestAnimationFrame(loop);
                    } else {
                        this.selected = null
                        resolve();
                    }
                };
                loop();
            },
        );
    }

    private searchHintPoints(selected: type.GameChipPosition): type.GameChipPosition[] {

        const positionString = common.PositionToSting(selected);
        const directions = this.board.directionMap[positionString];
        let hintPointList: type.GameChipPosition[] = [];
        directions.forEach((direction) => {
            //onsole.log(direction)
            hintPointList = hintPointList.concat(
                this.searchDirectionHintPoints(selected, this.board.vectors[direction]),
            );
        });

        return hintPointList;
    }

    private isOccupied(positionList: type.GameChipPosition[], testPoint: type.GameChipPosition): boolean {

        const occupied = positionList.filter(
            (point) => {
                return point.x === testPoint.x
                    && point.y === testPoint.y;
            },
        );
        return Boolean(occupied.length);
    }

    private searchDirectionHintPoints(
        selected: type.GameChipPosition,
        vec: type.GameChipPosition,
    ): type.GameChipPosition[] {
        const hintPointList: type.GameChipPosition[] = [];

        let testPoint = {
            x: selected.x + vec.x,
            y: selected.y + vec.y
        }

        //console.log({selected})
        //console.log({testPoint})

        const occupiedList = this.state.chips.map(chip => chip.position)

        while (this.isInMap(testPoint) && !this.isOccupied(
            occupiedList
            , testPoint)) {

            hintPointList.push(testPoint);

            testPoint = {
                x: testPoint.x + vec.x,
                y: testPoint.y + vec.y
            }
        }
        return hintPointList
    }

    private isInMap(position: type.GameChipPosition) {
        return position.x >= 1
            && position.x <= 5
            && position.y >= 1
            && position.y <= 5
    }

    private isInside(
        point1: type.GameChipPosition,
        point2: type.GameChipPosition) {
        const distence = Math.sqrt(
            Math.abs(point1.x * this.config.LATTICE.SIZE - point2.x) ** 2 +
            Math.abs(point1.y * this.config.LATTICE.SIZE - point2.y) ** 2);
        const hover = distence < this.config.GAME_CHIP.RADIUS;
        return hover;
    }
}
