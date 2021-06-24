console.log('initializing data');
const mongoose = require('mongoose');
const UserModel = require('../models/User');
const env = require('dotenv');
const { encryptPassword } = require("./authentication");

let envPath = 'environments/.env.development';
env.config({
	debug: process.env.DEBUG,
	path: envPath
});

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true }).then((info) => {
	createCollections().then(_ => {
		populateUser().then(user => {
			process.exit(0);
		}).catch((error) => {
			console.log("Populate data error >>", error.message);
			process.exit(1);
		});
	}).catch((error) => {
		console.log("Create collection err >>", error.message);
		process.exit(1);
	});
}).catch((error) => {
	console.log("MongoDB connection err >>", error.message);
	process.exit(1);
});

function createCollections() {
	return UserModel.createCollection();
}

function populateUser() {
	return new Promise((resolve, reject) => {
		UserModel.findOne({}).then(async (user) => {
			if (user) {
				await UserModel.deleteMany({});
			}
			const encryptPass = await encryptPassword('welcome');
			const USER_DATA = [
				{
					name: 'Andy Johnson',
					email: 'andy@example.com',
					password: encryptPass
				},
				{
					name: 'Bernard Hasibuan',
					email: 'bernard@example.com',
					password: encryptPass
				},
				{
					name: 'Charlie Angel',
					email: 'charlie@example.com',
					password: encryptPass
				},
				{
					name: 'Deepak',
					email: 'deepak@example.com',
					password: encryptPass
				},
				{
					name: 'Ernest Prakasa',
					email: 'ernest@example.com',
					password: encryptPass
				}
			];
			UserModel.create(USER_DATA).then(() => {
				console.log('User Created');
				resolve(0);
			}).catch((err) => reject(err));
		}).catch((err) => reject(err));
	});
}