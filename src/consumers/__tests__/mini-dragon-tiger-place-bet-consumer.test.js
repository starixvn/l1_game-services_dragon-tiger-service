import { stub } from "jest-micro-auto-stub";
import { Core } from "sc-game-base";
import gameSettings from "../../game-settings";

import MiniDragonTigerPlaceBetConsumer from "../mini-dragon-tiger-place-bet-consumer";

const definition = new Core.GameDefinition(gameSettings);
const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);

describe("MiniDragonTigerPlaceBetConsumer test", () => {
    const gameData = new Core.GameData();
    const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

    it("should inherit Core place bet consumer", () => {
        expect(consumer instanceof Core.BaseEventConsumers.PlaceBetConsumer);
    });
});

describe("BettingTimeValidation test", () => {
    it("should return invalid bet when game's disabled", () => {
        const gameData = new Core.GameData();
        gameData.gameConfigs = {
            enabled: false,
        };
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        const actualResult = consumer.composeBettingTimeValidationCriteria();

        expect(actualResult[0].failure).toBe(true);
    });

    it("should return invalid bet when betting after place bet time", () => {
        const gameData = new Core.GameData(31);
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        const actualResult = consumer.composeBettingTimeValidationCriteria();

        expect(actualResult[1].failure).toBe(true);
    });

    it("should return invalid bet when betting on waitting time", () => {
        const gameData = new Core.GameData(34);
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        const actualResult = consumer.composeBettingTimeValidationCriteria();

        expect(actualResult[2].failure).toBe(true);
    });

    it("should return valid bet when betting on place bet time", () => {
        const gameData = new Core.GameData(20);
        gameData.gameConfigs = {
            enabled: true,
        };
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        const validationCriteria = consumer.composeBettingTimeValidationCriteria();
        const actualResult = validationCriteria.some((criteria) => criteria.failure);

        expect(actualResult).toBe(false);
    });
});
