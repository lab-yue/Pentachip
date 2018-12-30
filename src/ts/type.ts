export interface GameConfig {
    COLOR: {
        BACKGROUND: string,
        GRID_LINE: string,
        SHADOW: string,
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

export type GameChipPositionArray = [AxisPoint, AxisPoint];

export interface GameChipPosition {
    x: AxisPoint;
    y: AxisPoint;
}

export type PlayerIndex = "P1" | "P2";

export interface GameChipInterface {
    id: string;
    position: GameChipPosition;
    ownedBy: PlayerIndex;
    selected: boolean;
    hover: boolean;
}

export interface BoardState {
    map: GameChipPosition[];
    chips: GameChipInterface[];
}

export interface GameState {
    turn: PlayerIndex;
    board: BoardState;
}

export interface Board {
    ctx: CanvasRenderingContext2D;
    load(): BoardState;
    draw(): void;
    redraw(): void;
}

export interface BoardPositionPath {
    from: GameChipPositionArray;
    to: GameChipPositionArray;
}

export type BoardPaths = BoardPositionPath[];

export interface Player {
    index: PlayerIndex;
}
