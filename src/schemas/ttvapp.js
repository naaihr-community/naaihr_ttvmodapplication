const mongoose = require("mongoose")

const giveawaySchema = new mongoose.model("ttvapp", new mongoose.Schema({
    user: { type: String },

    status: { type: String, default: "open" },

    channel: { type: String },
}))

module.exports = giveawaySchema;