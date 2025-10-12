require('dotenv').config();
const express = require('express');
const app = express();
const path = require('node:path');
const indexRouter = require('./router/indexRouter');
const categoryRouter = require('./router/categoryRouter');
const materialRouter = require('./router/materialRouter');
const errorMiddleware = require('./controllers/errorMiddleware');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));

app.use('/', indexRouter);
app.use('/category', categoryRouter);
app.use('/material', materialRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if (err) { 
        throw err 
    }
    console.log(`Server listening on port ${PORT}`);
});