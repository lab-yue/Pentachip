import GameChip from "./gamechip";
import { Board, BoardState, GameChipPosition } from "./type";
export default class DefaultMap implements Board {

    public map: GameChipPosition[];
    public mapInititalState: GameChip[];

    public load(): BoardState {

        const axis = [...Array(5).keys()];

        axis.map((x) => {
            axis.map((y) => {
                this.map.push({ x, y });
            });
        });

        axis.map((x) => {
            this.mapInititalState.push(
                new GameChip({ x, y: 0 }, "p1"),
            );
        });

        return [this.map, this.mapInititalState];
    }
}
