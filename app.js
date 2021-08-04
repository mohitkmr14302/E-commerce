require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const cookieparser = require('cookie-parser');
const Register = require('./db/models/register');
const bcrypt = require("bcryptjs");
const auth = require("./db/middleware/auth");

// C:\Users\m\Desktop\start\db\models\register.js
const app = express();
require("./db/conn");
app.set("view engine", "hbs");
app.use(express.static('public'));
app.use(cookieparser());
const partials_path = path.join(__dirname, 'public/partials');
// C:\Users\m\Desktop\start\partials


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('index');
})
app.get('/product', (req, res) => {
    res.render('product');
})

app.get('/register', (req, res) => {
    res.render('register');
})
app.get('/login', (req, res) => {
    res.render('login');
})

hbs.registerPartials(partials_path);
app.get('/cart', auth, (req, res) => {
    res.render("cart");
})
// hbs.registerPartials(partials_path);
app.get('/buynow', auth, (req, res) => {
    res.render("buynow");
})

app.get('/logout', auth, async (req, res) => {
    try {
        console.log(req.user);
        req.user.tokens = req.user.tokens.filter((currele) => {
            return currele !== req.token
        })
        res.clearCookie("jwt");
        console.log(req.user);
        await req.user.save();
        res.render('login');
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post("/register", async (req, res) => {
    try {
        const ppassword = req.body.password;
        const cpassword = req.body.cpassword;
        if (cpassword === ppassword) {
            const regemp = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                cpassword: req.body.cpassword,

            })
            const token = await regemp.generateauthtoken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            });
            const result = await regemp.save();
            res.status(201).render("index");
        } else {
            res.send("password are not matching");
        }
    } catch (err) {
        res.status(400).send(err);
    }
})




app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });
        //res.send(useremail.password)
        const ismatch = await bcrypt.compare(password, useremail.password);
        const token = await useremail.generateauthtoken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
            // secure: true
        });
        if (ismatch) {
            // if(useremail.password===password){
            res.status(201).render('index');
        }
        else {
            res.send("invalid userid or password")
        }
    } catch (error) {
        res.status(400).send("invalid email");
    }
})




app.listen(3000, () => {
    console.log("listen at port 3000");
})