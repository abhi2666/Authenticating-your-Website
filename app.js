//this dotenv is use to put your important keys like API Keys, secret strings or anything confedential
//secure by hiding them inside .env file..Remember to put .evn file into .gitignore so that 
// it does not get pushed into remote repositiory 
require('dotenv').config()

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10; // no. of times salting will be done to newly generated hash..

// const md5 = require('md5')
// this is used for encryption but with encryption comes encryption key which act as a vulnerability
// const encrypt = require('mongoose-encryption');
//we will remove that vulnerability by using hasing instead of simple encryption
// we will use md5 hashing algorithm
const app = express();
//set up view engine
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
//........................................

app.get("/", function (req, res) {
    res.render("home.ejs")
});


app.get("/login", function (req, res) {
    res.render("login.ejs")
});

app.get("/register", function (req, res) {
    res.render("register.ejs")
});

// configuring express session and passport
app.use(session({
    secret : "LOL",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/authDB');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// create a schema and then a model for the same
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// for hashing
userSchema.plugin(passportLocalMongoose);


// encrption should be applied in the schema itself before creating a model using it\
// when we push this code on any online repoisitory like github... the secret will become visible to 
// whosoever will access it which is a major security threat..so we will put it inside .env file to hide it

// userSchema.plugin(encrypt, {secret:process.env.HIDDEN_STRING, encryptedFields:["password"]});
// console.log("Password Field encrypted !");

const User = mongoose.model("Users", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// if user register 
app.post("/register", function (req, res) {

    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash // hashed passwd will be stored inside passwd field in database
    //     });
    //     // save this JSON object into the database (authDB)
    //     newUser.save()
    //         .then(savedDoc => {
    //             res.render("secrets.ejs");
    //         });
    // });

    // we will authenticate user with the local host
    


});

// if user login
app.post("/login", function(req, res){
    const Email = req.body.username;
    const passwd = req.body.password;

    // //checking if user with these credentials exists or not
    // User.findOne({email: Email})
    // .then((foundUser)=>{
    //   if(foundUser) {
    //     // bcrypt
    //     bcrypt.compare(passwd, foundUser.password).then(function(result) {
    //         if(result == true){
    //             console.log("Successful login !");
    //             res.render('secrets.ejs');
    //         }
    //         else{
    //             console.log("Something went Wrong !");
    //         }
    //     });
    //  }
    // })
    // .catch((err)=>{
    //   console.log(err)
    // })
    
})

//..........................................




app.listen(3000, function () {
    console.log("live on port 3000");
})