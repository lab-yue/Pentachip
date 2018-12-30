import { GameChipInterface, GameChipPosition, PlayerIndex } from "./type";

export default class GameChip implements GameChipInterface {

    public position: GameChipPosition;
    public ownedBy: PlayerIndex;

    constructor(position: GameChipPosition, ownedBy: PlayerIndex) {

        this.position = position;
        this.ownedBy = ownedBy;
    }
}
