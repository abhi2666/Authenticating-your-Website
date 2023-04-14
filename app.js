require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
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
// encrption should be applied in the schema itself before creating a model using it\
// when we push this code on any online repoisitory like github... the secret will become visible to 
// whosoever will access it which is a major security threat..so we will put it inside .env file to hide it
userSchema.plugin(encrypt, {secret:process.env.HIDDEN_STRING, encryptedFields:["password"]});
console.log("Password Field encrypted !");

const User = mongoose.model("Users", userSchema);

// if user register 
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    // save this JSON object into the database (authDB)
    newUser.save()
        .then(savedDoc => {
            res.render("secrets.ejs");
        });
});

// if user login
app.post("/login", function(req, res){
    const Email = req.body.username;
    const passwd = req.body.password;

    //checking if user with these credentials exists or not
    User.findOne({email : Email, password : passwd})
    .then(()=>{
        res.render("secrets.ejs");
    })
    
})

//..........................................




app.listen(3000, function () {
    console.log("live on port 3000");
})