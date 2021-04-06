import { Core } from "sc-game-base";
import { ResultHelper } from "../helpers/index";

export default class MiniDragonTigerRoundQuery extends Core.QueryApis.RoundQuery {
    convertSettlementResult(roundResult) {
        return ResultHelper.getSettlementResult(roundResult);
    }

    convertResult(round) {
        return {
            dragon: round.dragon,
            tiger: round.tiger,
        };
    }
}
