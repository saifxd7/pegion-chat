const dynamoose = require('dynamoose');


const schema = new dynamoose.Schema({
    id: {
        type: String,
        hashKey: true,
        required: true,
    },
    username: { 
        type: String,
        required: true, 
        /*
        (?![_.])(?!.*[_.]{2})
        (?=.{8,20}$) username is 8-20 Char,
        [a-zA-Z0-9._] allowed char,
        [a-zA-Z0-9._] no _ or . at the end, 
        validate: /^(?=.{8,20}$)[a-zA-Z0-9._]+(?<![_.])$/, 
        */
    },
    name: { 
        type: String,
        required: true,
    },
    mobileNo: { 
        type: Number,
        required: true,
        // validate: /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
    
    },
    profilePic: {
        type: String,
        default: "https://cdn-icons.flaticon.com/png/512/2102/premium/2102633.png?token=exp=1638800006~hmac=4da519f5f850e9686475e53cc152c5c6"
    }
    
},
{
    "timestamps": {
        "createdAt": "createDate",
        "updatedAt": "updateDate"
    }
});


const User = dynamoose.model('Users', schema, {
    create: true,
});

module.exports = { User };