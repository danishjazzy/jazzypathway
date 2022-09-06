const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost:27017/myDB');


console.log("Database Connected");

const loginSchema = new mongoose.Schema({
    name: String,
    username: String,
    birthday:{
        type:Date,
        date:false
    },
    gender:String,
    email: String,
    phone: Number,
    password:  String,
    confirmPassword:String,
    tokens: [{
        token: String
    }]
});

loginSchema.methods.generateToken = async function () {

    try {
        const token = jwt.sign({ _id: this._id }, 'iamworkingonmyjazzypathwayproject')
        this.tokens = this.tokens.concat({ token })
        await this.save()
        return token;
    } catch (error) {
        console.log()
    }
}

const signupData = new mongoose.model('userData', loginSchema)


module.exports = signupData;