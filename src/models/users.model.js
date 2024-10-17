const {Schema , model} =  require('mongoose');

const UsersCollection  = 'Users'

const UsersSchema  = new Schema({
    first_name: {
        type: String,
    },
    last_name:String,
    
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
});
const userModel = model(UsersCollection , UsersSchema) 

module.exports = {
    userModel
}