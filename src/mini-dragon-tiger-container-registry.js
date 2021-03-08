import awilix from "awilix";
import { Core } from "sc-game-base";

import PlaceBetConsumer from "./consumers/mini-dragon-tiger-place-bet-consumer";
import { MiniDragonTigerBot, MiniDragonTigerGameCron } from "./crons";
import { MiniDragonTigerBets, MiniDragonTigerRounds, MiniDragonTigerTmpBets } from "./models";
import MiniDragonTigerRoundQuery from "./query-apis/mini-dragon-tiger-round-query";

const { asClass, asValue } = awilix;

export default class MiniDragonTigerContainerRegistry extends Core.ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(MiniDragonTigerRounds),
            betsRepository: asValue(MiniDragonTigerBets),
            tempBetsRepository: asValue(MiniDragonTigerTmpBets),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(MiniDragonTigerBot).singleton(),
            gameCron: asClass(MiniDragonTigerGameCron).singleton().proxy(),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            roundQuery: asClass(MiniDragonTigerRoundQuery).singleton().proxy(),
        });
    }
}
