import GameChip from "./gamechip";
import { GameChipInterface, PlayerIndex } from "./type";

export default class Pentachip {
    public turn: PlayerIndex;
    public GameChips: GameChipInterface[];

    constructor() {
        this.GameChips = [];
    }

    public start(startBy: PlayerIndex) {
        this.turn = startBy;
        [...Array(5).keys()].map((index) =>
            this.GameChips.push(
                new GameChip({ x: 0, y: index }, "p1"),
                new GameChip({ x: 0, y: index }, "p2"),
            ),
        );
        console.log(this.GameChips);
    }
}
