const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: false }))

require('dotenv').config();


const mongoose = require('mongoose');


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', function () {
    console.log('MongoDB database connection established successfully')
})

db.on("error", () => {
    console.log("Error");
});

app.set('view engine', 'pug');
app.set('views', 'views');

const userRoute = require('./app/router/route.user');

app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.PORT, () => {
  console.log(`Application listening on port ${process.env.PORT}`)
})