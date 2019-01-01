import Pentachip from "./pentachip";

const game = new Pentachip();
game.start("P1");

// game.move("1-1").to({ x: 2, y: 2 })
//    .then(
//        () => game.move("3-5").to({ x: 3, y: 3 }),
//    ).then(
//        () => game.move("3-5").to({ x: 4, y: 4 }),
//    );
//
