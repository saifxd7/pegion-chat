const express = require('express')
const app = express()

// Getting Environment variables
require('dotenv').config()

// config 
const database = require('./config/dynamo');

// routes 
const userRouter = require('./routes/user');
const roomRouter = require('./routes/room');

const port = process.env.PORT || '3000';

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(port,() => {
    console.log(`App listening on http://localhost:${port}/`)
})

app.get("/", (req, res) => {
    res.send('Hello World!');
});

app.use('/user', userRouter);
app.use('/room', roomRouter);


// Catch Not found 404 and forward to error handler
app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist'
    })
})