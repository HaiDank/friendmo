import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import { create } from 'express-handlebars';
import path from 'path';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
// app.use(helmet());
app.use(cors());
app.use(express.json());

const hbs = create({ partialsDir: ['./views/partials/'], extname: 'hbs' });

app.use(express.static(path.join(__dirname, '..', 'public')));
// views
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

app.get<{}, MessageResponse>('/', (req, res) => {
	res.render('index');
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
