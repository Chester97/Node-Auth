const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const { JwtStrategy } = require('./jwt');

passport.use(JwtStrategy);


//CONNECT WITH DB
async function connectToDB() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async () => console.log('connected'));
    await mongoose.connect('mongodb://localhost:27017/auth', {
        authSource: 'admin',
        user: 'admin',
        pass: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
connectToDB();

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`))