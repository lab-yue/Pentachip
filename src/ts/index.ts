import Pentachip from "./pentachip";
const canvas = document.getElementById('game')
const game = new Pentachip(canvas as HTMLCanvasElement);

game.start("P1");
const test = game.state.chips[0];
game.move(test).to({ x: 2, y: 2 });
setTimeout(
    () => game.move(test).to({ x: 2, y: 3 }),
    2000)
