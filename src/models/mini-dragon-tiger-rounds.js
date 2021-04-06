import mongoose from "mongoose";

const modelName = "MiniDragonTiger_phien";

const resultSchema = new mongoose.Schema(
    {
        dragon: { type: Object },
        tiger: { type: Object },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        dragon: { type: Boolean, default: false },
        tiger: { type: Boolean, default: false },
        tie: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

export default mongoose.model(modelName, Schema);
