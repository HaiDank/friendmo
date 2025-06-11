import * as express from 'express-serve-static-core';
import { UserType } from '../models/users';

declare global {
	namespace Express {
		interface Request {
			user?: UserType;
		}
	}
}
