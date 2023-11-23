import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errors } from '../src/services/error';
import { pageNotFound } from './services/userService';
import { googleRoutes } from './router/googleRoutes';
import { friendRequestRoutes } from './router/friendRequestRouter';
import { messageRoutes } from './router/messageRouter';
import '../src/socketClient';
import { userRoutes } from '../src/router/userRouter';
import './controller/passport';

dotenv.config();

export const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/auth/user', userRoutes);
app.use('/', googleRoutes);
app.use('/api', friendRequestRoutes);
app.use('/api', messageRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.use(express.static(`${__dirname}/views/pages`));
app.use(express.static(`${__dirname}/views/image`));
app.use(express.static(`${__dirname}/views/css`));

app.listen(port, () => {
  console.log(`server listen at ${port}`);
});

app.use('/*', pageNotFound);
app.use(errors);
