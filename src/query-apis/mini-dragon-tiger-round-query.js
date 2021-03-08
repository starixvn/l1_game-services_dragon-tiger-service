import { Core } from "sc-game-base";

export default class MiniSeDieRoundQuery extends Core.QueryApis.RoundQuery {
    convertResult(round) {
        return {
            red1: round.red1,
            red2: round.red2,
            red3: round.red3,
            red4: round.red4,
        };
    }
}
