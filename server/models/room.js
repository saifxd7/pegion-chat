const { User } = require('../models/user');
// const { Message } = require('../models/message');
const dynamoose = require('dynamoose');

const ROOM_TYPES = {
    TYPE_PRIVATE: "private",
    TYPE_GROUP: "group",
}

module.exports = { ROOM_TYPES }

const schema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        schema: [String],
        required: true,
    },
    admin: {
        type: String,
        schema: Object,
    },
    messages: {
        type: Array,
        schema: [Object],
    },
    archived: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    }
},
{
    "timestamps": {
        "createdAt": "createDate",
        "updatedAt": "updateDate"
    }
});




const Room = dynamoose.model('Rooms', schema, {
    create: true,
});

module.exports = { Room };