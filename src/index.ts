require('dotenv').config();
import express from 'express';
import {Request, Response} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import userRoutes from './route/user';

import connectDB from '../config/db';

connectDB();

const app = express();
app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

//using route
app.use('/app', userRoutes)
app.get('/health', (req: Request, res: Response) => {
    console.log('check health')
    res.send("You're healthy")
})
app.get('/', (req: Request, res: Response) => {
    console.log('checking home page')
    res.send('OK')
})


const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is running perfectly well');
});