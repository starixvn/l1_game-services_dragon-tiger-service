import { getSettlementResult, generateResult } from "../src/helpers/result-helper";

function run() {
    const totalRounds = 100_000;
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

    const randomMode = 3;

    for (let index = 0; index < totalRounds; index++) {
        const result = generateResult(randomMode);
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
    console.log(`======== Run ${totalRounds} rounds ========`);

    console.log(stats);
    console.log(`Longest streaks (>=${longestStreak}): `);
    console.log(JSON.stringify(streaks));
}

run();
