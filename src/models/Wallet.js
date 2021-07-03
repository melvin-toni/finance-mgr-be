const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA = new mongoose.Schema({
    account_id: Schema.Types.ObjectId,
    balance: { type: Number, default: 0 },
    spending_limit_per_day: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', SCHEMA);