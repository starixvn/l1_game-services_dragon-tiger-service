import { generateResult, getSettlementResult } from "../../src/helpers/result-helper";

describe("result statistic: 100,000 times", () => {
    const calculateStreaks = (streaks, settlementResult, continuity) => {
        Object.keys(continuity).forEach((key) => {
            if (settlementResult[key]) {
                continuity[key]++;
            } else {
                if (continuity[key] >= 4) {
                    streaks[key][continuity[key]] = streaks[key][continuity[key]] ?? 0;
                    streaks[key][continuity[key]] += 1;
                }
                continuity[key] = 0;
            }
        });
    };
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = {
                dragon: 0,
                tiger: 0,
                tie: 0,
            };
            const streaks = { dragon: {}, tiger: {}, tie: {} };
            const continuity = { dragon: 0, tiger: 0, tie: 0 };

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                statisticResult.dragon += +settlementResult.dragon;
                statisticResult.tiger += +settlementResult.tiger;
                statisticResult.tie += +settlementResult.tie;
                calculateStreaks(streaks, settlementResult, continuity);
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / total) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            console.log(`streak on mode ${index + 1}: ${JSON.stringify(streaks, null, 2)}`);

            expect(resultPercentage.dragon).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.tiger).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.tie).toBeLessThanOrEqual(10);
        });
    }
});
