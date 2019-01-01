import Pentachip from "./pentachip";
import { PlayerIndex } from "./type";
(async () => {
    const game = new Pentachip();
    const players: PlayerIndex[] = ["P1", "P2"];
    game.start(game.choose(players));
    await game.run();
})();
