const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: String,
    loot: Array, /*[
        {
            name: String,
            iconUrl: String,
            icon: String,
            buyPrice: Number,
            type: String,
            amount: Number,
            stats: JSON,
        }
    ],*/
    hp: Number,
    level: Number,
    username: String,
    currency: Number,
    dead: Boolean,
    weapon: JSON,
});

module.exports = mongoose.model("User", UserSchema);