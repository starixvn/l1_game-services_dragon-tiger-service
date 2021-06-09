import { Core } from "sc-game-base";

export default class MiniDragonTigerGameCron extends Core.Crons.BaseGameCron {
    isStartingTime(remainingTime, durations) {
        return remainingTime === durations.placingBets + durations.shakeThePlateDuration;
    }

    async getLastArchiveRound() {
        const archiveStatus = await this.archiveStatusesRepository.findOne({ name: "minidragontiger" }, "lastArcId").lean().exec();

        return archiveStatus ? archiveStatus.lastArcId["_phiens"] + 1 : 1;
    }
}
