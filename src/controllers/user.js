const TAG = "controllers.user";
const UserModel = require("../models/User");
const WalletModel = require("../models/Wallet");
const { encryptPassword } = require("../helpers/authentication");
const { StatusCodes } = require("http-status-codes");
const {
    traceLog,
    successLog,
    failedLog
} = require("../helpers/logger");

exports.register = async (req, res) => {
    traceLog(`${TAG} >> register`);

    try {
        if (await UserModel.findOne({ email: req.body.email })) {
            failedLog(req, res, {
                status: false, message: 'User with the email exists', code: StatusCodes.BAD_REQUEST
            });
        } else {
            await UserModel.create({
                name: req.body.name,
                email: req.body.email,
                password: await encryptPassword(req.body.password)
            });

            successLog(req, res, {
                status: true,
                message: 'Register success',
                code: StatusCodes.CREATED
            });
        }

    } catch (error) {
        failedLog(req, res, {
            status: false, message: 'Register failed', debug: error, code: StatusCodes.BAD_REQUEST
        });
    }
}

exports.createFinAcc = async (req, res) => {
    traceLog(`${TAG} >> createFinAcc`);

    try {
        await WalletModel.create({
            account_id: req.user._id,
            balance: req.body.balance,
            spending_limit_per_day: req.body.spending_limit_per_day
        });

        successLog(req, res, {
            status: true,
            message: 'Create finance account success',
            code: StatusCodes.CREATED
        });
    } catch (error) {
        failedLog(req, res, {
            status: false, message: 'Create finance account failed', debug: error, code: StatusCodes.BAD_REQUEST
        });
    }
}

exports.readAllFinAcc = async (req, res) => {
    traceLog(`${TAG} >> readAllFinAcc`);

    try {
        let _limit = parseInt(req.query.limit) ? parseInt(req.query.limit) * 1 : 10;
        let _skip = parseInt(req.query.index) ? parseInt(req.query.index) * _limit : 0;
        const excludeField = {
            'account_id': 0,
            'createdAt': 0,
            'updatedAt': 0,
            '__v': 0
        }
        const pagination = {
            skip: _skip, limit: _limit
        };

        const doc = await WalletModel.find({_id: req.user._id}, excludeField, pagination);

        successLog(req, res, {
            status: true,
            message: 'Read all finance account success',
            code: StatusCodes.OK,
            result: doc
        });
    } catch (error) {
        failedLog(req, res, {
            status: false, message: 'Read all finance account failed', debug: error, code: StatusCodes.BAD_REQUEST
        });
    }
}