import { cards } from "../cards";

const shuffleCards = (cards) => {
    for (let i = cards.length; i > 0; i--) {
        const randomCardIndex = Math.floor(Math.random() * i--);
        const term = cards[i];

        cards[i] = cards[randomCardIndex];
        cards[randomCardIndex] = term;
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
