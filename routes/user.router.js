const express = require("express"); //imoport express.
const bcrypt = require("bcrypt"); //import bcrypt.
const jwt = require("jsonwebtoken"); //import jsonwebtoken
const { UserModel } = require("../models/user.model"); // import User Model from models.

const userRouter = express.Router();

//asynchronous funtion to register user.
userRouter.post("/register", async (req, res) => {

    //get and destructure name/phone/email/password/role from req body.
    const { name, email, password, role } = req.body;

    //try and catch block to catch any errors.
    try {
        //check if user already registerd.
        const existUser = await UserModel.findOne({ email });

        //return already registered response if user exist.
        if (existUser) {
            return res.json({ msg: "User already Registerd" });
        }
        // hash the password using bcrypt and store in variable hash.
        const hash = await bcrypt.hash(password, 6);

        //return failed to hash password response if failed.
        if (!hash) {
            return res.json({ msg: "failed to create password!" });
        }
        //set user detail in data base and store in variable newUser
        const newUser = new UserModel({ name, email, password: hash, role });

        //save the user in data base and return registered successfully response.
        await newUser.save();
        res.json({ msg: "User Registerd Successfully!" });
    }
    catch (err) {
        //log any error if catch.
        console.log("catch error", err);
    }
})

//asynchronous funtion to get the user profile.
userRouter.get("/profile", async (req, res) => {

    //try and catch block to catch any errors.
    try {
         //get the token from authorization if exist, and split by space to get the second element as token.
        const token = req.headers.authorization?.split(" ")[1];

        //return please login response when token is false.
        if (!token) {
            return res.json({ msg: "PLease Login!" });
        }
        
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "recipe");

        //return inavalid token response when decoded is false.
        if (!decoded) {
            return res.json({ msg: "invalid token!" });
        }

         //get user's id from decoded varable that is passed when token generated.
        const userid = decoded.userId;

        //get the existing user by their id and capture in existUser variabe.
        const existUser = await UserModel.findById(userid);

        //return user not found response when existUser is false.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check the user role and authorized accordingly.
        if (existUser?.role === "user") {
            //find user by id and populate their recipe and store in getUser variable.
            const getUser = await UserModel.findById(userid).populate("recipe");
            //return getUser in response.
            return res.json({ msg: getUser });
        }

        //check the user role and authorized accordingly.
        else if (existUser?.role === "admin") {
             //find user by id and populate their recipe and store in getAllUser variable.
            const getAllUser = await UserModel.find().populate("recipe");
            return res.json({ msg: getAllUser });
        }
        else {
            //return not authorized response.
            return res.json({ msg: "You are not authorized!" });
        }
    } 
    catch (err) {
        
    }
})

//asynchronous funtion to update the user.
userRouter.patch("/profileUpdate/:id", async (req, res) => {
    //get the token from authorization if exist, and split by space to get the second element as token.
    const token = req.headers.authorization?.split(" ")[1];
    //get and destructure name/phone/email/password/role from req body.
    const {name, email, password, role} = req.body;
    // get and destructure id from req params.
    const { id } = req.params;
    //try and catch block to catch any errors.
    try {
        //return please login response when token is false.
        if (!token) {
            return res.json({ msg: "PLease Login!" })
        }
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "recipe");
        //return inavalid token response when decoded is false.
        if (!decoded) {
            return res.json({ msg: "invalid token!" })
        }
        //get user's id from decoded varable that is passed when token generated.
        const userid = decoded.userId;
        //get the existing user by their id and capture in existUser variabe.
        const existUser = await UserModel.findById(userid);
        //return user not found response when existUser is false.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check the user role and authorized accordingly.
        if(existUser.role === "admin"){
            // hash the password using bcrypt and catch in variable hash.
            const hash = await bcrypt.hash(password, 6);
            if(!hash){
                return res.json({msg: "failed encrypt password!"})
            }
            // find user from user model and update and save again.
            await UserModel.findByIdAndUpdate(id, {name, email, password:hash, role }, {new:true});
            return res.json({msg: "User profile updated successfulli!"});
        }

        //check the user role and authorized accordingly.
        else if(existUser.role === "user"){
            // hash the password using bcrypt and catch in variable hash.
            const hash = await bcrypt.hash(password, 6);
            //return failed to encrypt response if hash failed.
            if(!hash){
                return res.json({msg: "failed encrypt password!"})
            }
            
            //veryfy that user can only update their own profile.
            if(existUser._id.toString() === id.toString()){
                // find user from user model and update and save again.
                await UserModel.findByIdAndUpdate(id, {name, email, password:hash, role });
                return res.json({msg: "User profile updated successfulli!"});
            }
        }
    }
    catch (err) {
        // return any error catched by try and catch block.
        return console.log("catch error", err)
    }
})

//asynchronous funtion to delete the user.
userRouter.delete("/profileDelete/:id", async (req, res) => {
    //get the token from authorization if exist, and split by space to get the second element as token.
    const token = req.headers.authorization?.split(" ")[1];
   
    // get and destructure id from req params.
    const { id } = req.params;
    //try and catch block to catch any errors.
    try {
        //return please login response when token is false.
        if (!token) {
            return res.json({ msg: "PLease Login!" })
        }
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "recipe");
        //return inavalid token response when decoded is false.
        if (!decoded) {
            return res.json({ msg: "invalid token!" })
        }
        //get user's id from decoded varable that is passed when token generated.
        const userid = decoded.userId;
        //get the existing user by their id and capture in existUser variabe.
        const existUser = await UserModel.findById(userid);
        //return user not found response when existUser is false.
        if (!existUser) {
            return res.json({ msg: "User not found!" });
        }

        //check the user role if its admin or not.
        if(existUser.role === "admin"){

            // find user from user model and delete
            await UserModel.findByIdAndDelete(id);
            
            return res.json({msg: "User profile deleted successfully!"});
        }

        //check the user role
        else if(existUser.role === "user"){
            
            //veryfy that user can only delete their own profile.
            if(existUser._id.toString() === id.toString()){
                // find user from user model and delete.
                await UserModel.findByIdAndDelete(id);
                return res.json({msg: "User profile deleted successfully!"});
            }
            //return not authorized response.
            return res.json({msg: "You are not authorized"});
        }
        //return not authorized response.
        return res.json({msg: "You are not authorized"});

    }
    catch (err) {
        // return any error catched by try and catch block.
        return console.log("catch error", err)
    }
})

// export user router.
module.exports = { userRouter };