const express = require('express');
const app = express();

const cookieparser = require('cookie-parser');

app.use(cookieparser());


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

const verifyAuth = require('./app/middleware/verifyAuth');

// app.use('/auth', verifyAuth);
app.get('/my-profile', (req, res) => {
    return res.send("My Profile - " + req.user.email);    
});

app.get('/your-profile', (req, res) => {
    return res.send("Your Profile - " + req.user.email);    
});

app.listen(process.env.PORT, () => {
  console.log(`Application listening on port ${process.env.PORT}`)
})