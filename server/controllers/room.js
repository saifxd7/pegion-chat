// Utils
const makeValidation = require('@withvoid/make-validation');
const { v4: uuidv4 } = require('uuid');

// Models
const { Room } = require('../models/room');
const { User } = require('../models/user');
const { Message } = require('../models/message')

module.exports = {
    onRoomInitiate: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    type: { type: types.enum, options: { enum: {0: "private", 1: "group" }}, default: {0: "private"} },
                    members: { 
                        type: types.array, 
                        options: { unique: true, empty: false, stringOnly: true } 
                    },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const { members, type } = req.body;
            const { ...data } = req.body;
            const allMembers = [...members]; // req.userId
        
            availableRoom = await Room.scan().attribute(["members"]).contains(members[0]).and().attribute(["members"]).contains(members[1]).and().where("type").eq(type);
            if (availableRoom[0]){
                console.log(availableRoom[0])
                return res.status(200).json({
                    isNew: false,
                    message: 'retrieving an old chat room',
                    roomId: availableRoom[0].id,
                    type: availableRoom[0].type,
                });
            }else{
                const room = await Room.create({
                    id: uuidv4(),
                    members: allMembers,
                    type,      
                }, { ...data }
                );
                return res.status(200).json({ success: true, room });
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    getConversationByRoomId: async (req, res) => {
        try {
            
            const { roomId } = req.params;
            const room = await Room.query("id").eq(roomId).exec();
    
            if (!room) {
                return res.status(400).json({
                success: false,
                message: 'No room exists for this id',
                })
            }
            const users = await User.scan().where("id").in(room[0].members).exec();
            
            const options = {
                // page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            
            const conversation = await Message.scan().attribute("room_id").eq(roomId).limit(options.limit).exec();
            
            return res.status(200).json({
                success: true,
                conversation,
                users,
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    postMessage: async (req, res) => {
        try {
            const { roomId } = req.params;
            const validation = makeValidation(types => ({
                payload: req.body,
                type: { type: types.enum, options: { enum: {0: "text",1: "photo",2: "video",3: "voice"}} },
        
                checks: {
                    message_content: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            availableRoom = await Room.query('id').eq(roomId).exec();
            if (availableRoom[0]){
                // console.log(availableRoom[0])

                // const currentLoggedUser = req.userId; // get current user from auth service
                const saifid = "13508415-7560-40c4-b1b3-aeeb9c292475"
                const markid = "70042e8f-5b7f-43f3-a25b-a68e682736f2"

                const { message_content } = req.body;
                const { ...data } = req.body;

                const post = await Message.create({
                    id: uuidv4(),
                    room_id: roomId,
                    message_content,
                    postByUser: saifid,
                    readByRecipents: [{readByUserId: saifid}]
                }, {...data});

                const updateRoom = Room.update({ id: roomId},{ 
                    messages: [{
                        message_id: post.id,
                    }]
                })

                global.io.sockets.in(roomId).emit('new message', { message: post });

                return res.status(200).json({ success: true, post, updateRoom });
            }else{
                return res.status(500).json({ success: false, error: error })
            }

            
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onGetAllRoomsByUser: async (req, res) => {
        try {
            // const currentLoggedUser = req.userId; // get current user from auth service
            // for example 
            const currentLoggedUser = "13508415-7560-40c4-b1b3-aeeb9c292475"
            const rooms = await Room.scan().attribute("members").contains(currentLoggedUser).exec();
            
            // if userid is present in room=>members[] then return that rooms 
            if (rooms[0]){
                console.log(rooms[0])
                return res.status(200).json({ success: true, rooms });
            } else {
                return res.status(500).json({ success: false, error: error })
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    markConversationReadByRoomId: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await Room.query("id").eq(roomId).exec();
            if (!room) {
                return res.status(400).json({
                success: false,
                message: 'No room exists for this id',
                })
            }

            // const currentLoggedUser = req.userId
            const currentLoggedUser = "13508415-7560-40c4-b1b3-aeeb9c292475"

            const result = await Message.update({ room_id: roomId},{ 
                readByRecipents: [{
                    readByUserId: currentLoggedUser,
                }]
            })
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    }
}