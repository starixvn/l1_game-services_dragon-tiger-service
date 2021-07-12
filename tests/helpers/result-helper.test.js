import { cards } from "../../src/cards";
import { generateResult, getSettlementResult } from "../../src/helpers/result-helper";

describe("generateResult test", () => {
    it("should return dragon/tiger card from desk of cards", () => {
        const actualResult = generateResult();

        expect(cards).toContain(actualResult.dragon);
        expect(cards).toContain(actualResult.tiger);
    });
});

describe("getSettlementResult test", () => {
    const testCases = [
        {
            result: {
                dragon: {
                    card: 1,
                    type: 1,
                },
                tiger: {
                    card: 1,
                    type: 2,
                },
            },
            expectSettlementResult: { dragon: false, tiger: false, tie: true },
        },
        {
            result: {
                dragon: {
                    card: 10,
                    type: 1,
                },
                tiger: {
                    card: 2,
                    type: 2,
                },
            },
            expectSettlementResult: { dragon: true, tiger: false, tie: false },
        },
        {
            result: {
                dragon: {
                    card: 1,
                    type: 3,
                },
                tiger: {
                    card: 9,
                    type: 1,
                },
            },
            expectSettlementResult: { dragon: false, tiger: true, tie: false },
        },
    ];

    it.each(testCases)("should return correct settlement result", ({ result, expectSettlementResult }) => {
        const actualResult = getSettlementResult(result);

        expect(actualResult).toEqual(expectSettlementResult);
    });
});
