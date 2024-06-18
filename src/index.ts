import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose';

const app = express();
const uri = "mongodb://mongoadmin:secret@localhost:27017/?authSource=admin";

app.use(cors({
    credentials: true,
}));

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('It works!');
});

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running XXXXXXXXXXXXXXXXXXXXXX');
});

mongoose.Promise = Promise;
mongoose.connect(uri);
mongoose.connection.on('error', (error: any) => console.log(error));
