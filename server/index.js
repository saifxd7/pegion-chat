const http = require('http');
const { Server } = require('socket.io')

const express = require('express')
const app = express()

// Getting Environment variables
require('dotenv').config()

// config 
const database = require('./config/dynamo');

// utils 
const { Websockets } = require('./utils/Websockets');

// routes 
const userRouter = require('./routes/user');
const roomRouter = require('./routes/room');

const port = process.env.PORT || '3000';

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



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

// Create Http Server
const server = http.createServer(app)
const socketio = new Server({ server })

// Create Socket Connection
global.io = socketio.listen(server);
global.io.on('connection', Websockets.connection)

// Listen on provided port, on all network interfaces
server.listen(port);

// Event listener for HTTP server "listening" Event
server.on("listening", () => {
    console.log(`listening on port: http://localhost:${port}/`)
})
