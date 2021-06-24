const TAG = "controllers.auth";
const UserModel = require("../models/User");
const { checkPassword, generateToken } = require("../helpers/authentication");
const { StatusCodes } = require("http-status-codes");
const {
	traceLog,
	successLog,
	failedLog
} = require("../helpers/logger");

exports.checkLogin = async (req, res) => {
	traceLog(`${TAG} >> checkLogin`);

	try {
		let user = await UserModel.findOne({ email: req.body.email });
		if (user) {
			const password = user.password;
			const chkPass = await checkPassword(req.body.password, password);
			if (chkPass) {
				let resUser = JSON.parse(JSON.stringify(user));
				delete resUser['_id'];
				delete resUser['is_deleted'];
				delete resUser['password'];
				delete resUser['createdAt'];
				delete resUser['updatedAt'];
				delete resUser['__v'];
				resUser['token'] = await generateToken(resUser, '8h');
				successLog(req, res, {
					status: true, message: 'Login success', result: resUser, code: StatusCodes.OK
				});
			} else {
				failedLog(req, res, {
					status: false, message: 'Data not found', code: StatusCodes.NOT_FOUND
				});
			}
		} else {
			failedLog(req, res, {
				status: false, message: 'User not found', code: StatusCodes.NOT_FOUND
			});
		}
	} catch (error) {
		failedLog(req, res, {
			status: false, message: 'Login failed', debug: error, code: StatusCodes.BAD_REQUEST
		});
	}
}