require ('dotenv').config();
import express from 'express';
//import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import connectDB from '../config/db';

connectDB();

const app = express();
app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is running perfectly well');
});