const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const RSA_PRIVATE_KEY = fs.readFileSync('jwtRS256.key', 'utf8');

exports.checkPassword = (plainTxt, hash) => {
	return new Promise((resolve, reject) => {
		const combinedPlainTxt = plainTxt + process.env.PEPPER_KEY;
		bcrypt.compare(combinedPlainTxt, hash).then((result) => {
			resolve(result);
		}).catch((error) => {
			reject(error);
		});
	});
}

exports.encryptPassword = (plainTxt) => {
	return new Promise((resolve, reject) => {
		const combinedPlainTxt = plainTxt + process.env.PEPPER_KEY;
		bcrypt.hash(combinedPlainTxt, parseInt(process.env.SALT_ROUND), (err, hash) => {
			if (err) {
				reject('Hashing password failed');
			}
			resolve(hash);
		});
	});
}

exports.generateToken = (payload, expireTime) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, {
			key: RSA_PRIVATE_KEY
		}, {
			algorithm: 'RS256',
			expiresIn: expireTime
		},
			(error, token) => {
				if (error) reject(error);
				resolve(token);
			});
	});
}