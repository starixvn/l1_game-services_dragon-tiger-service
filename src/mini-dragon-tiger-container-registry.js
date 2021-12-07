import awilix from "awilix";
import { Core } from "sc-game-base";

import { MiniDragonTigerPlaceBetConsumer, MiniDragonTigerSettleGameRoundConsumer } from "./consumers";
import { MiniDragonTigerBot, MiniDragonTigerGameCron } from "./crons";
import { MiniDragonTigerBets, MiniDragonTigerRounds } from "./models";

const { asClass, asValue } = awilix;

export default class MiniDragonTigerContainerRegistry extends Core.ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(MiniDragonTigerRounds),
            betsRepository: asValue(MiniDragonTigerBets),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(MiniDragonTigerPlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(MiniDragonTigerSettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(MiniDragonTigerBot).singleton(),
            gameCron: asClass(MiniDragonTigerGameCron).singleton().proxy(),
        });
    }
}
