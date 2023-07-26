const mongoose= require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    number: {
        type: String,
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value); //Checking if phone no. is of 10 digits //
            },
            message: 'Phone number should be 10 digits'
        },
    },
    password: String
});


const UserModel=mongoose.model('User',UserSchema);

module.exports = UserModel;