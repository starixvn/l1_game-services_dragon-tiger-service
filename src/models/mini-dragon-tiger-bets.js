import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },

    dragon: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    tiger: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    currency: { type: String, require: true },
    rate: { type: Number, require: true },

    playerId: { type: Number },
    operatorId: { type: String, require: true },
    roundId: { type: Number, required: true },
    paid: { type: Boolean, default: false },
});

const bets = mongoose.model("MiniDragonTiger_cuoc", schema);

export { bets as MiniDragonTigerBets };
