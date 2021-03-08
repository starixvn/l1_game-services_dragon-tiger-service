import { Core } from "sc-game-base";

export default class MiniDragonTigerRoundQuery extends Core.QueryApis.RoundQuery {
    convertResult(round) {
        return {
            dragon: round.dragon,
            tiger: round.tiger,
        };
    }
}
