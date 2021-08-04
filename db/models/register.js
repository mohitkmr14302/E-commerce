const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const employeeschema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

employeeschema.methods.generateauthtoken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send(error);
    }
}


employeeschema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        // this.cpassword = undefined;
        this.cpassword = await bcrypt.hash(this.password, 10);
    }
    next();
})
const Register = new mongoose.model("Register", employeeschema);
module.exports = Register;