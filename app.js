const express = require('express');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const dotenv = require('dotenv');
const userModel = require('./models/user.model.js');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});