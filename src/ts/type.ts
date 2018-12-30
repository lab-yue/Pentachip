export interface Config {
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

export type AxisPoint = number;

export interface GameChipPosition {
    x: AxisPoint;
    y: AxisPoint;
}

export type PlayerIndex = "p1" | "p2";

export interface GameChipInterface {
    position: GameChipPosition;
    ownedBy: PlayerIndex;
}

export type BoardState = [GameChipPosition[], GameChipInterface[]];

export interface Game {
    turn: PlayerIndex;
    BoardState: BoardState;
}

export interface Board {
    load(): BoardState;
}

export interface Player {
    index: PlayerIndex;
}
