declare namespace Pentachip {

    interface Config {
        PLAYER: {
            COLOR_1: string;
            COLOR_2: string;
        };
        LATTICE: {
            SIZE: number;
        };
        Game_Chip: {
            RADIUS: number;
        };
    }

    type AxisPoint = number;

    interface GameChipPosition {
        x: AxisPoint;
        y: AxisPoint;
    }

    type PlayerIndex = "p1" | "p2";

    interface GameChip {
        position: GameChipPosition;
        ownedBy: PlayerIndex;
    }

    interface Game {
        turn: PlayerIndex;
        GameChips: GameChip[];
    }

    type BoardState = [GameChipPosition[], GameChip[]];

    interface Board {
        load(): BoardState;
    }

    interface Player {
        index: PlayerIndex;
    }

}
