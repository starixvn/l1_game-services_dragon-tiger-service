import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import constants from "./constants";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult } from "./helpers/result-helper";
import MiniDragonTigerContainerRegistry from "./mini-dragon-tiger-container-registry";

const run = async () => {
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult);
    const gameData = new Core.GameData(gameSettings.durations.wholeRound, constants.resetTotalBets);
    const container = new MiniDragonTigerContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("MiniDragonTiger", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
