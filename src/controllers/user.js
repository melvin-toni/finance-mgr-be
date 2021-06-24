const TAG = "controllers.user";
const UserModel = require("../models/User");
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