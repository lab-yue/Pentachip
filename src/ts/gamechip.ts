import { GameChipInterface, GameChipPosition, PlayerIndex } from "./type";

export default class GameChip implements GameChipInterface {
    public id: string;
    public position: GameChipPosition;
    public ownedBy: PlayerIndex;
    public selected: boolean;
    public hover: boolean;

    constructor(position: GameChipPosition, ownedBy: PlayerIndex) {

        this.position = position;
        this.ownedBy = ownedBy;
        this.id = `${position.x}-${position.y}`;
        this.hover = false;
        this.selected = false;
    }
}
