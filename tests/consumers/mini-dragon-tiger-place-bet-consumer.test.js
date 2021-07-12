import { stub } from "jest-micro-auto-stub";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

import MiniDragonTigerPlaceBetConsumer from "../../src/consumers/mini-dragon-tiger-place-bet-consumer";
import gameSettings from "../../src/game-settings";

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
        // arrange
        const gameData = new Core.GameData();
        gameData.gameConfigs = {
            enabled: false,
        };
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        // act
        const criterions = consumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("should return invalid bet when betting after place bet time", () => {
        // arrange
        const gameData = new Core.GameData(31);
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        // act
        const criterions = consumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("should return invalid bet when betting on waitting time", () => {
        // arrange
        const gameData = new Core.GameData(34);
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);

        // act
        const criterions = consumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
        });
    });

    it("should return placeBetNextRound notice if roundId not match running round", () => {
        // arrange
        const gameData = new Core.GameData(20);
        gameData.roundId = 2;
        gameData.gameConfigs.enabled = true;
        const placeBetConsumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData);

        // act
        var criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

        // assert
        expect(criterions).not.toBeEmpty();
        expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
            failure: true,
            notice: { errorCode: helpers.noticeHelper.invalidBet, gameRoundId: 1 },
        });
    });

    it("should return valid bet when betting on place bet time", () => {
        // arrange
        const gameData = new Core.GameData(20);
        gameData.gameConfigs = {
            enabled: true,
        };
        const consumer = new MiniDragonTigerPlaceBetConsumer(definition, gameData, publisher);
        const validationCriteria = consumer.composeBettingTimeValidationCriteria(1);

        // act
        const actualResult = validationCriteria.some((criteria) => criteria.failure);

        // assert
        expect(actualResult).toBe(false);
    });
});
