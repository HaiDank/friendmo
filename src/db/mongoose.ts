import mongoose from 'mongoose';
import 'dotenv/config';

console.log(process.env.MONGODB_URL);

const connectWithRetry = () => {
	console.log('MongoDB connection attempt...');
	mongoose
		.connect(
			process.env.MONGODB_URL ??
				'mongodb://mongo:27017/friendmo?replicaSet=rs0'
		)
		.then(() => {
			console.log('db connected');
		})
		.catch((err) => {
			console.error(
				'❌ MongoDB connection failed, retrying in 5s...',
				err.message
			);
			setTimeout(connectWithRetry, 5000);
		});
};
connectWithRetry();
