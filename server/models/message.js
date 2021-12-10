const dynamoose = require('dynamoose');

const schema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        required: true,
    },
    room_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "text",
    },
    message_content: {
        type: String,
        required: true,
    },
    parent_message: dynamoose.THIS,
    postByUser: {
        type: String,
        required: true
    },
    readByRecipents: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                readByUserId: String,
                readAt: {
                    type: Date,
                    default: Date.now(),
                },
            }
        }]
    },
    sent: {
        type: Boolean,
        default: false
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