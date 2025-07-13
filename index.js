const express = require("express"); //import express.
const cors = require("cors"); //import cors.
const path = require("path")
const mongoose = require("mongoose"); //import mongoose.
const {userRouter} = require("./routes/user.router"); //import user router from routes.
const {bookRouter} = require("./routes/books.router"); //import book router from routes.
const {myBookRouter} = require("./routes/my_books.router"); //import book router from routes.
const {loginRouter} = require("./routes/auth.router"); //import login router from routes

const app = express(); //initilize app variable to store express access.
app.use(express.json()); //initialize express json to 
app.use(cors()); //call cors middle ware to solve cors error.
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/auth", userRouter); //user's endpoint/routes.
app.use("/", bookRouter); //book's endpoint/routes.
app.use("/", myBookRouter); //book's endpoint/routes.
app.use("/auth", loginRouter); //login endpoint/routes

//server local host initilizing.
app.listen(3211, async() => {

    //try catch block to catch any error.
    try {
        //connecting to data base through mongoose.
        await mongoose.connect("mongodb+srv://kumaravi0506:Gabriel%40511@myfirst-cluster.nvsvh.mongodb.net/Books-data?retryWrites=true&w=majority&appName=MyFirst-Cluster");
        console.log("connected to database");
        console.log("server running at http://localhost:3211");
    } 
    catch (err) {
        //log any error if fails to connect.
        console.log("catch error", err);
    }

})