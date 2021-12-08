// Utils
const makeValidation = require('@withvoid/make-validation');
const { v4: uuidv4 } = require('uuid');

// Models
const { Room , ROOM_TYPES} = require('../models/room');
const { User } = require('../models/user');

module.exports = {
    onRoomInitiate: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    type: { type: types.enum, options: { enum: ROOM_TYPES} },
                    members: { 
                        type: types.array, 
                        options: { unique: true, empty: false, stringOnly: true } 
                    },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const { members, type } = req.body;
            const { ...data } = req.body;
            // const allMembers = [...members];
        
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
                }, { ...data });
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
            console.log(users)
            const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            };
            
            // const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
            return res.status(200).json({
                success: true,
                // conversation,
                users,
            });
        } catch (error) {
        return res.status(500).json({ success: false, error: error })
        }
    }
}