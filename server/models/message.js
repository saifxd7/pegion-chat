const { User } = require('../models/user');
const { Room } = require('../models/room');
const dynamoose = require('dynamoose');

module.exports = {
    MESSAGE_TYPE: {
        TYPE_TEXT: 'text',
        TYPE_PHOTO: 'photo',
        TYPE_VIDEO: 'video',
        TYPE_VOICE: 'voice'
    }
}  
    

const readByRecipientSchema = new dynamoose.Schema(
    {
        id: false,
        readByUserId: String,
        readAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: false,
    }
);

const schema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        required: true,
    },
    room_id: {
        type: Object,
        schema: Room
    },
    message_type: {
        type: String,
        default: () => MESSAGE_TYPE.TYPE_TEXT,
    },
    message_content: {
        type: String,
        required: true,
    },
    parent_message: dynamoose.THIS,
    postByUser: {
        type: String,
        schema: User,
        required: true
    },
    readByRecipents: {
        type: Array,
        schema: [readByRecipientSchema]
    },
    sent: {
        type: Boolean,
        default: true
    },
    delivered: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    
},
{
    "timestamps": {
        "createdAt": "createDate",
        "updatedAt": "updateDate"
    }
});


const Message = dynamoose.model('Messages', schema, {
    create: true,
});

module.exports = { Message };