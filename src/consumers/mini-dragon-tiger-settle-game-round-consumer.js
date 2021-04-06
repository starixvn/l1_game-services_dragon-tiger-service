import { Core } from "sc-game-base";

export default class MiniDragonTigerSettleGameRoundConsumer extends Core.BaseEventConsumers.SettleGameRoundConsumer {
    calculateBetResult(settlementResult, bet, odds) {
        this.tieChoice = "tie";

        const betResult = Object.entries(settlementResult).reduce(
            (result, [choice, win]) => {
                const betAmount = bet[choice] ?? 0;
                const originalOdds = odds[choice] || 1;
                const effectiveOdds = bet.freeBet ? originalOdds - 1 : originalOdds;
                let winAmount = win ? betAmount * effectiveOdds : 0;

                if (choice !== this.tieChoice && settlementResult[this.tieChoice]) {
                    winAmount += betAmount / 2;
                }

                result.totalBetAmount += betAmount;
                result.totalWin += winAmount;
                result.winningByChoices[choice] = winAmount;

                if (winAmount > 0) {
                    result.netWin += winAmount - betAmount;
                } else {
                    result.totalLost += betAmount;
                }

                return result;
            },
            {
                totalBetAmount: 0,
                totalWin: 0,
                netWin: 0,
                totalLost: 0,
                winningByChoices: {},
            }
        );

        betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
        betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

        return betResult;
    }
}
