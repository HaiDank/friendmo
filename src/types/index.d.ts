import * as express from 'express-serve-static-core';
import {  UserDocument } from '../interfaces/User';

declare global {
	namespace Express {
		interface Request {
			user?: UserDocument;
		}
	}
}
