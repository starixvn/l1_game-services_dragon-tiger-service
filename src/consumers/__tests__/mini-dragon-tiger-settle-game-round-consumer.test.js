import { Core } from "sc-game-base";
import MiniDragonTigerSettleGameRoundConsumer from "../mini-dragon-tiger-settle-game-round-consumer";

const definition = new Core.GameDefinition({ id: 1, name: "game name" });
const gameData = new Core.GameData();
gameData.gameConfigs = {
    enabled: true,
    minbet: 1,
    maxbet: 1000,
    choices_maxbet: {
        odd: 1000,
        even: 1000,
    },
    odds: {
        dragon: 2,
        tiger: 2,
        tie: 11,
    },
    enableFreeBet: false,
};

const consumer = new MiniDragonTigerSettleGameRoundConsumer({
    definition,
    gameData,
});

describe("MiniDragonTigerSettleGameRoundConsumer test", () => {
    it("should inherit SettleGameRoundConsumer", () => {
        expect(MiniDragonTigerSettleGameRoundConsumer instanceof Core.BaseEventConsumers.SettleGameRoundConsumer);
    });
});

describe("calculateBetResult test", () => {
    const testCases = [
        {
            settlementResult: { dragon: true, tiger: false, tie: false },
            bet: { tie: 50, tiger: 100 },
            expectResult: {
                totalBetAmount: 150,
                totalWin: 0,
                netWin: 0,
                totalLost: 150,
                winningByChoices: { dragon: 0, tiger: 0, tie: 0 },
            },
        },
        {
            settlementResult: { dragon: false, tiger: true, tie: false },
            bet: { dragon: 100 },
            expectResult: {
                totalBetAmount: 100,
                totalWin: 0,
                netWin: 0,
                totalLost: 100,
                winningByChoices: { dragon: 0, tiger: 0, tie: 0 },
            },
        },
        {
            settlementResult: { dragon: false, tiger: true, tie: false },
            bet: { tie: 50, tiger: 100 },
            expectResult: {
                totalBetAmount: 150,
                totalWin: 200,
                netWin: 100,
                totalLost: 50,
                winningByChoices: { dragon: 0, tiger: 200, tie: 0 },
            },
        },
        {
            settlementResult: { dragon: true, tiger: false, tie: false },
            bet: { dragon: 100 },
            expectResult: {
                totalBetAmount: 100,
                totalWin: 200,
                netWin: 100,
                totalLost: 0,
                winningByChoices: { dragon: 200, tiger: 0, tie: 0 },
            },
        },
        {
            settlementResult: { dragon: false, tiger: false, tie: true },
            bet: { dragon: 100, tie: 100, tiger: 100 },
            expectResult: {
                totalBetAmount: 300,
                totalWin: 1200,
                netWin: 900,
                totalLost: 0,
                winningByChoices: { dragon: 50, tiger: 50, tie: 1100 },
            },
        },
        {
            settlementResult: { dragon: true, tiger: false, tie: false },
            bet: { dragon: 100, tie: 100, tiger: 100, freeBet: true },
            expectResult: {
                totalBetAmount: 300,
                totalWin: 100,
                netWin: 0,
                totalLost: 200,
                winningByChoices: { dragon: 100, tiger: 0, tie: 0 },
            },
        },
    ];

    it.each(testCases)("should return correct result", ({ settlementResult, bet, expectResult }) => {
        const actualResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds);

        expect(actualResult).toEqual(expectResult);
    });

    it("should return correct result when missing odds config", () => {
        const settlementResult = { dragon: true, tiger: false, tie: false };
        const expectResult = {
            netWin: 0,
            totalBetAmount: 50,
            totalLost: 0,
            totalWin: 50,
            winningByChoices: {
                dragon: 50,
                tie: 0,
                tiger: 0,
            },
        };
        const actualResult = consumer.calculateBetResult(settlementResult, { dragon: 50 }, { tie: 11, tiger: 2 });

        expect(actualResult).toEqual(expectResult);
    });
});
