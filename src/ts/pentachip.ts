class GameChip implements Pentachip.GameChip {

    public position: Pentachip.GameChipPosition;
    public ownedBy: Pentachip.PlayerIndex;

    constructor(position: Pentachip.GameChipPosition, ownedBy: Pentachip.PlayerIndex) {

        this.position = position;
        this.ownedBy = ownedBy;
    }
}

class DefaultMap implements Pentachip.Board {

    constructor() { }

    public load(): Pentachip.BoardState {

        const axis = [...Array(5).keys()];

        let map: Pentachip.GameChipPosition[];
        let mapInititalState: Pentachip.GameChip[];

        axis.map((x) => {
            axis.map((y) => {
                map.push({ x, y });
            });
        });

        axis.map((x) => {
            mapInititalState.push(
                new GameChip({ x, y: 0 }, "p1"),
            );
        });

        return [map, mapInititalState];
    }
}

class Player {
    constructor(color: string) { }
}

export default class Pentachip {
    public turn: Pentachip.PlayerIndex;
    public GameChips: Pentachip.GameChip[];

    constructor() {
        this.GameChips = [];
    }

    public start(startBy: Pentachip.PlayerIndex) {
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
