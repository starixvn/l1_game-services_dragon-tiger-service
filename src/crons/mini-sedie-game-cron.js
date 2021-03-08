import { Core, Table } from "sc-game-base";

export default class VipSeDieGameCron extends Core.Crons.BaseGameCron {
    isStartingTime(remainingTime, durations) {
        return remainingTime === durations.placingBets + durations.shakeThePlateDuration;
    }
}
