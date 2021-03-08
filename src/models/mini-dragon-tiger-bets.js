import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    dragon: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    tiger: { type: Number, default: 0 },

    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

const bets = mongoose.model("MiniDragonTiger_cuoc", schema);
const tmpBets = mongoose.model("MiniDragonTiger_tmpcuoc", schema);

export { bets as MiniSeDieBets, tmpBets as MiniSeDieTmpBets };
