const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SCHEMA = new mongoose.Schema({
    name: String,
    email: { type: String, trim: true, unique: true },
    password: String,
    by: Schema.Types.ObjectId,
    is_deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', SCHEMA);