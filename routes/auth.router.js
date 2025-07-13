const express = require("express"); //import express.
const bcrypt = require("bcrypt"); //import bcrypt to compare the encrypted password
const jwt = require("jsonwebtoken"); //import jsonwebtoken to generate token.
const {UserModel} = require("../models/user.model"); // import user model from models to access user model.

//create login router using express router.
const loginRouter = express.Router(); 

//asynchronous funtion to fetch the post request from front end side.
loginRouter.post("/userLogin", async(req, res) => {
    //get email and password from request body/user's input from front end side.
    const {email, password} = req.body;
    //write the code in try and catch block to catch any errors.
    try {
        //find existing user by given email.
        const existUser = await UserModel.findOne({email});
        //return user not found response when existUser false.
        if(!existUser){
            return res.json({msg: "User not found!"});
        }
        //compaire the encrypted password to check wether password is correct or not, and capture the value in compaire variable.
        const compaire = await bcrypt.compare(password, existUser.password);
        //return inavalid password response when compaire is false.
        if(!compaire){
            return res.json({msg: "invalid password!"});
        }
        //generate token, pass the user' id, secrate key and token expiration time.
        const token = jwt.sign({userId: existUser._id}, "recipe", {expiresIn: "1h"});
        //return failed to generate token response when token is false.
        if(!token){
            return res.json({msg: "failed to generate token!"});
        }
        //return login successful message and token after succesfull login.
        return res.json({msg: "Login Successfull!", token:token});
    } 
    //retun any error in the process.
    catch (err) {
        return console.log("catch error", err);
    }
})

//export the login router.
module.exports = {loginRouter};