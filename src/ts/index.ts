import Pentachip from "./pentachip";
const canvas = document.getElementById("game");
const game = new Pentachip(canvas as HTMLCanvasElement);

game.start("P1");

const test = game.state.chips;

game.move(test[0]).to({ x: 2, y: 2 })
    .then(
        () => game.move("3-5").to({ x: 3, y: 3 }),
    )
    .then(
        () => game.move(test[4]).to({ x: 4, y: 2 }),
    ).then(
        () => game.move("3-5").to({ x: 4, y: 4 }),
    );