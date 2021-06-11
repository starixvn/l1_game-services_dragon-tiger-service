import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core } from "sc-game-base";
import MiniDragonTigerBot from "../mini-dragon-tiger-bot";
import gameSettings from "../../game-settings";
import constants from "../../constants";

const definition = new Core.GameDefinition(gameSettings);
const gameData = new Core.GameData(0);
const publisher = stub(Core.BaseEventPublishers);
/** @type {mongoose.Model}*/
/** @type {mongoose.Model}*/
const tempBetsRepository = stubMongooseModelStupidly(mongoose.Model);
const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
const miniDragonTigerBot = new MiniDragonTigerBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
const bot = {
    id: 1,
    name: "bot1",
    red: 1000,
    type: true,
    choices: [],
    remainTickets: 3,
    totalBet: 0,
    betOnChoices: { ...constants.resetTotalBets },
};
const totalBetTemplate = {
    dragon: 1000,
    tiger: 800,
    tie: 300,
};

const gameConfigs = {
    choices_maxbet: {
        dragon: 2000,
        tiger: 2000,
        tie: 500,
    },
    minbet: 1,
    bot_maxbet: 200,
};

gameData.gameConfigs = gameConfigs;

describe("MiniDragonTigerBot inherit test", () => {
    it("should inherit BaseBot", () => {
        expect(MiniDragonTigerBot instanceof Core.Crons.BaseBot);
    });
});

describe("placeBet test", () => {
    it("should ignore bot bet when lock bet", async () => {
        const tempGameData = new Core.GameData(3);
        tempGameData.gameConfigs = gameConfigs;
        const tempMiniDragonTigerBot = new MiniDragonTigerBot(definition, tempGameData);

        await tempMiniDragonTigerBot.placeBet({});

        expect(tempMiniDragonTigerBot.totalTickets).toEqual(0);
        expect(tempMiniDragonTigerBot.smallTickets).toEqual(0);
        expect(tempMiniDragonTigerBot.allBets).toEqual(constants.resetTotalBets);
    });

    it("should capture bot bet when bet on valid time", async () => {
        const tempGameData = new Core.GameData(23);
        tempGameData.gameConfigs = gameConfigs;
        const tempMiniDragonTigerBot = new MiniDragonTigerBot(definition, tempGameData);

        await tempMiniDragonTigerBot.placeBet({});

        expect(tempMiniDragonTigerBot.totalTickets).toEqual(1);
        expect(Object.keys(tempMiniDragonTigerBot.allBets).length > 0);
    });
});

describe("reset test", () => {
    it("should call super reset", () => {
        spyOn(Core.Crons.BaseBot.prototype, "reset");

        miniDragonTigerBot.reset();

        expect(Core.Crons.BaseBot.prototype.reset).toHaveBeenCalled();
    });

    it("should remove all bots when disable bot", async () => {
        const tempGameData = new Core.GameData(23);
        tempGameData.gameConfigs = {
            botenabled: false,
        };
        const tempMiniDragonTigerBot = new MiniDragonTigerBot(definition, tempGameData);
        tempMiniDragonTigerBot.bots = [bot];

        await tempMiniDragonTigerBot.reset();

        expect(tempMiniDragonTigerBot.bots).toEqual([]);
    });
});

describe("resetAllBotData test", () => {
    it("should call resetAllBets and resetAllBotData", () => {
        spyOn(Core.Crons.BaseBot.prototype, "resetAllBotData");
        spyOn(MiniDragonTigerBot.prototype, "resetAllBets");

        miniDragonTigerBot.resetAllBotData();

        expect(Core.Crons.BaseBot.prototype.resetAllBotData).toHaveBeenCalled();
        expect(MiniDragonTigerBot.prototype.resetAllBets).toHaveBeenCalled();
    });
});

describe("resetAllBets test", () => {
    it("should allBets and smallTickets reset to zero", () => {
        miniDragonTigerBot.smallTickets = 4;
        miniDragonTigerBot.allBets = { ...totalBetTemplate };

        miniDragonTigerBot.resetAllBets();

        expect(miniDragonTigerBot.smallTickets).toBe(0);
        expect(miniDragonTigerBot.allBets).toEqual(constants.resetTotalBets);
    });
});

describe("getBetChoice test", () => {
    it("should return main options when main bet ratio hasn't reached", () => {
        miniDragonTigerBot.allBets = {
            dragon: 300,
            tiger: 500,
            tie: 100,
        };

        const choice = miniDragonTigerBot.getBetChoice(bot);

        expect(miniDragonTigerBot.mainOpts).toContain(choice);
    });

    it("should return rare options when main reached", () => {
        miniDragonTigerBot.allBets = {
            dragon: 500,
            tiger: 500,
            tie: 1,
        };

        const choice = miniDragonTigerBot.getBetChoice(bot);

        expect(miniDragonTigerBot.rareOpts).toContain(choice);
    });
});

describe("getMaxBet test", () => {
    it("should return value between min and max bet config", () => {
        const choice = "tiger";
        const { bot_maxbet, minbet, choices_maxbet } = gameData.gameConfigs;
        const maxBet = Math.min(bot_maxbet, choices_maxbet[choice]);

        const actualResult = miniDragonTigerBot.getMaxBet({ ...bot, betOnChoices: { ...totalBetTemplate } }, choice);

        expect(actualResult).toBeWithin(minbet, maxBet);
    });
});

describe("getRandomChoiceFromGroup test", () => {
    test.each`
        group                          | groupName
        ${miniDragonTigerBot.mainOpts} | ${"main"}
        ${miniDragonTigerBot.rareOpts} | ${"rare"}
    `("should return options of $groupName group", ({ group }) => {
        const choice = miniDragonTigerBot.getRandomChoiceFromGroup(group);

        expect(group).toContain(choice);
    });
});

describe("getTotalAmountOnChoiceGroup test", () => {
    test.each`
        group                          | groupName | expectResult
        ${miniDragonTigerBot.mainOpts} | ${"main"} | ${1800}
        ${miniDragonTigerBot.rareOpts} | ${"rare"} | ${300}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        miniDragonTigerBot.allBets = { ...totalBetTemplate };

        const totalAmountOnGroup = miniDragonTigerBot.getTotalAmountOnChoiceGroup(group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getTotalAmountOfBotOnChoiceGroup test", () => {
    test.each`
        group                          | groupName | expectResult
        ${miniDragonTigerBot.mainOpts} | ${"main"} | ${1800}
        ${miniDragonTigerBot.rareOpts} | ${"rare"} | ${300}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        const betOnChoices = { ...totalBetTemplate };

        const totalAmountOnGroup = miniDragonTigerBot.getTotalAmountOfBotOnChoiceGroup({ betOnChoices }, group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getAllBetAmount test", () => {
    it("should return total amount bot bets", () => {
        miniDragonTigerBot.allBets = { ...totalBetTemplate };

        const actualResult = miniDragonTigerBot.getAllBetAmount();

        expect(actualResult).toEqual(2100);
    });
});

describe("isSmallTicket test", () => {
    it("should return true when amount below 50 times minbet", () => {
        const amount = 49;

        const actualResult = miniDragonTigerBot.isSmallTicket(amount);

        expect(actualResult).toBe(true);
    });
});

describe("getTotalBetAmount test", () => {
    it("should zero when current bet is undefined", () => {
        const actualResult = miniDragonTigerBot.getTotalBetAmount();

        expect(actualResult).toEqual(0);
    });

    it("should return total bet amount", () => {
        const currentBet = { ...totalBetTemplate };

        const actualResult = miniDragonTigerBot.getTotalBetAmount(currentBet);

        expect(actualResult).toEqual(2100);
    });
});
