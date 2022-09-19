import { userInfos } from "sc-base-database";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

export default class MiniDragonTigerBot extends Core.Crons.BaseBot {
    constructor(definition, gameData, userInfosRepository, appConfigs) {
        super(definition, gameData, userInfosRepository);
        this.appConfigs = appConfigs;

        this.betChoiceRatio = {
            MainOpts: 99, //odd | even
            RareOpts: 1, //red4 | white4
        };

        this.mainOpts = ["dragon", "tiger"];
        this.rareOpts = ["tie"];

        this.smallTicketRatio = 70;
        this.smallTickets = 0;
        this.resetAllBets();
    }

    async placeBet(bot) {
        const choice = this.getBetChoice(bot);
        const minBet = this.getMinBet();
        const maxBet = this.getMaxBet(bot, choice);
        const betAmount = this.appConfigs.convertChips
            ? this.convertAmountToChip(helpers.numberHelper.getRandomNumberStep5(minBet, maxBet, true))
            : this.getBetAmount(minBet, maxBet);

        if (this.gameData.remainingTime > this.definition.durations.lockingBet) {
            this.gameData.totalBets[choice] = (this.gameData.totalBets[choice] ?? 0) + betAmount;
            this.allBets[choice] = (this.allBets[choice] ?? 0) + betAmount;
            this.totalTickets++;

            if (this.isSmallTicket(betAmount)) {
                this.smallTickets++;
            }
        }
    }

    getBetAmount(minBet, maxBet) {
        return this.chance.integer({ min: minBet, max: maxBet });
    }

    async reset() {
        await super.reset();

        const configs = this.gameData.gameConfigs;

        if (configs?.botenabled) {
            const bots = await userInfos.find({ type: true, disabled: false }, "id name").lean().exec();

            this.bots = this.chance.shuffle(bots).slice(0, this.maxNumberOfBots);
        } else {
            this.bots = [];
        }
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            dragon: 0,
            tiger: 0,
            tie: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.mainOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.mainOpts) * 100) / totalBotBet < this.betChoiceRatio.MainOpts,
            },
            {
                group: this.rareOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.rareOpts) * 100) / totalBotBet < this.betChoiceRatio.RareOpts,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        return underRatioGroups.length > 0
            ? this.getRandomChoiceFromGroup(underRatioGroups[0].group)
            : this.getRandomChoiceFromGroup(this.mainOpts);
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
        let maxBet = Math.min(gameConfigs.choices_maxbet[choice], gameConfigs.bot_maxbet);

        const maxBetOfSmallTicket = Math.min(minBet * 50, maxBet);

        if (this.rareOpts.includes(choice)) {
            maxBet = Math.min(minBet * 10, gameConfigs.bot_maxbet * 0.2, gameConfigs.choices_maxbet[choice]);
            const totalAmountOnRateOpts = this.getTotalAmountOnChoiceGroup(this.rareOpts);

            if (totalAmountOnRateOpts > 0) {
                maxBet -= totalAmountOnRateOpts;
            }
        }

        if (this.mainOpts.includes(choice)) {
            maxBet = isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.max(maxBet, minBet);
    }

    getRandomChoiceFromGroup(group) {
        return this.chance.pickone(group);
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }

    getTotalBetAmount(currentBet) {
        return currentBet ? this.definition.choices.reduce((total, choice) => total + currentBet[choice], 0) : 0;
    }

    convertAmountToChip(amount) {
        const chipList = this.appConfigs.chips.filter((chip) => amount / chip >= 1);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }
}
