const dynamoose = require('dynamoose');


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
        schema: [{
            type: String
        }],
        required: true,
    },
    admin: {
        type: String,
        schema: Object,
    },
    messages: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                message_id: String,
            }
        }],
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