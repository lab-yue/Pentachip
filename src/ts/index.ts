import Pentachip from "./pentachip";

(async () => {
    const game = new Pentachip();
    game.start("P1");
    await game.auto();
})();