const {Schema , model} =  require('mongoose');

const UsersCollection  = 'Users'

const UsersSchema  = new Schema({
    first_name: {
        type: String,
        required:true
    },
    last_name:String,
    
    email:{
        type:String,
        required:true,
        unique:true
    }
});
const userModel = model(UsersCollection , UsersSchema) 

module.exports = {
    userModel
}