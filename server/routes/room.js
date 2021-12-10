// Controller
const roomController = require('../controllers/room');

const express = require('express');
const router = express.Router();


router
    .get('/', roomController.onGetAllRoomsByUser)
    .post('/initiate', roomController.onRoomInitiate)
    .get('/:roomId', roomController.getConversationByRoomId)
    .post('/:roomId/message', roomController.postMessage)
    .put('/:roomId/mark-read', roomController.markConversationReadByRoomId)
    
module.exports = router