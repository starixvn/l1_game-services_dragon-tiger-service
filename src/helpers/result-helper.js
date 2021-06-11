import { cards } from "../cards";

const shuffleCards = (deskOfCards) => {
    for (let i = deskOfCards.length - 1; i >= 0; i -= 2) {
        const randomCardIndex = Math.floor(Math.random() * (i + 1));
        const term = deskOfCards[i];

        deskOfCards[i] = deskOfCards[randomCardIndex];
        deskOfCards[randomCardIndex] = term;
    }
};

const settlementRuleEntries = Object.entries({
    dragon: (roundResult) => roundResult.dragon.card > roundResult.tiger.card,
    tiger: (roundResult) => roundResult.tiger.card > roundResult.dragon.card,
    tie: (roundResult) => roundResult.tiger.card === roundResult.dragon.card,
});

export const generateResult = () => {
    const deskOfCards = [...cards];

    shuffleCards(deskOfCards);
    shuffleCards(deskOfCards);
    shuffleCards(deskOfCards);

    const result = deskOfCards.slice(0, 2);

    return { dragon: result[0], tiger: result[1] };
};

export const getSettlementResult = (roundResult) => {
    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(roundResult);

        return result;
    }, {});
};
