import express from 'express';
import userRouter from './routes/user.routes.js';
import indexRouter from './routes/index.routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToDB from './config/db.js';

dotenv.config();
connectToDB();

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/style.css', (req, res) => {
    res.sendFile(process.cwd() + '/views/style.css');
});

app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});