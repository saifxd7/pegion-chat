// Controller
const roomController = require('../controllers/room');

const express = require('express');
const router = express.Router();


router
    .post('/initiate', roomController.onRoomInitiate)
    .get('/:roomId', roomController.getConversationByRoomId)

    
module.exports = router