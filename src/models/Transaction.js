const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA = new mongoose.Schema({
    account_id: Schema.Types.ObjectId,
    deposit: { type: Number, default: 0 },
    withdrawal: { type: Number, default: 0 },
    description: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', SCHEMA);