import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose';
import router from './router'
import { merge } from 'lodash';

const app = express();
const uri = "mongodb://mongoadmin:secret@localhost:27017/?authSource=admin";

app.use(cors({
    credentials: true,
}));

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
// logger middleware
app.use((req: express.Request ,res: express.Response, next: express.NextFunction) =>{
    const time = new Date(Date.now()).toString();
    merge(req, {time: time})
    console.log(req.method,req.hostname, req.path, time);
    next();
});

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running XXXXXXXXXXXXXXXXXXXXXX');
});

mongoose.Promise = Promise;
mongoose.connect(uri);
mongoose.connection.on('error', (error: any) => console.log(error));

app.use('/', router())