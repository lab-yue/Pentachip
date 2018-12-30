export interface GameConfig {
    COLOR: {
        P1: string;
        P2: string;
    };
    LATTICE: {
        SIZE: number;
    };
    GAME_CHIP: {
        RADIUS: number;
        SPEED: number
    };
}

export type AxisPoint = number;

export type GameChipPositionArray = [AxisPoint, AxisPoint]

export type GameChipPosition = {
    x: AxisPoint;
    y: AxisPoint;
}

export type PlayerIndex = "P1" | "P2";

export interface GameChipInterface {
    position: GameChipPosition;
    ownedBy: PlayerIndex;
}

export type BoardState = {
    map: GameChipPosition[];
    chips: GameChipInterface[];
};

export type GameState = {
    turn: PlayerIndex;
    board: BoardState;
};

export interface Board {
    ctx: CanvasRenderingContext2D;
    load(): BoardState;
    draw(): void;
}

export type BoardPositionPath = {
    from: GameChipPositionArray,
    to: GameChipPositionArray
}

export type BoardPaths = BoardPositionPath[]

export interface Player {
    index: PlayerIndex;
}
