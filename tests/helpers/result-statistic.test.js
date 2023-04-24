import { randomModes, generateResult, getSettlementResult } from "../../src/helpers/result-helper";

describe("Result statistic: 100000 times", () => {
    it.each(Object.keys(randomModes))("statistic should have expected result with mode %d", (mode) => {
        // Arrange
        const totalRounds = 100000;
        const streaks = {
            dragon: {},
            tiger: {},
        };
    
        const streakNumber = 4;
        const longestStreak = 4;
        let occurrences = 0;
        let prev = "dragon";
        const stats = {
            streaks: { total: 0, dragon: 0, tiger: 0 },
        };
    
        for (let index = 0; index < totalRounds; index++) {
            const result = generateResult(mode);
            const settlement = getSettlementResult(result);
    
            if (settlement[prev]) {
                occurrences++;
            } else {
                if (occurrences >= streakNumber) {
                    stats.streaks.total++;
                    stats.streaks[prev]++;
    
                    if (occurrences >= longestStreak) {
                        streaks[prev][occurrences] = streaks[prev][occurrences] ?? 0;
                        streaks[prev][occurrences]++;
                    }
                }
    
                prev = settlement.dragon ? "dragon" : "tiger";
                occurrences = 1;
            }
    
            Object.keys(settlement).reduce((choiceResults, choice) => {
                stats[choice] = stats[choice] ?? { count: 0, ratio: 0 };
                stats[choice].count += settlement[choice] ? 1 : 0;
                stats[choice].ratio = stats[choice].count / totalRounds;
            }, {});
        }
        
        // Assert
        console.log(`======== Run ${totalRounds} rounds ========`);
        console.log(stats);  
        expect(stats["dragon"].ratio).toBeGreaterThanOrEqual(0.45);
        expect(stats["tiger"].ratio).toBeGreaterThanOrEqual(0.45);
        expect(stats["tie"].ratio).toBeGreaterThanOrEqual(0.05);
    });
});
