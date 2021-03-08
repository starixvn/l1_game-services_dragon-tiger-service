import { Core } from "sc-game-base";
import { resultHelper } from "../helpers/index";

export default class MiniDragonTigerRoundQuery extends Core.QueryApis.RoundQuery {
    convertSettlementResult(roundResult) {
        return resultHelper.convertSettlementResult(roundResult);
    }

    convertResult(round) {
        return {
            dragon: round.dragon,
            tiger: round.tiger,
        };
    }
}
