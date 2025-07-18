const express = require("express"); //import express.
const jwt = require("jsonwebtoken"); //import bcrypt to compare the encrypted password
const {BookModel} = require("../models/my_books.model"); // import bookmodel from models to access bookmodel.
const { UserModel } = require("../models/user.model"); // import user model from models to access user model.

//create books router using express router.
const myBookRouter = express.Router();


//asynchronous funtion to fetch the post request from front end side.
myBookRouter.post("/addBook", async(req, res) => {
    //get the token from authorization if exist, and split by space to get the second element as token.
    const token = req.headers.authorization?.split(" ")[1];

    //get the title, status and rating from request body/user's input from front end side by destructure.
    const {title, status, rating } = req.body;
    //write the code in try and catch block to catch any errors.
    try {
         //return please login response when token is false.
        if(!token){
            return res.json({msg: "PLease Login!"});
        }
        //verify token wether its valid and genuine or not, and capture the value in decoded variable.
        const decoded = jwt.verify(token, "my_book");
        //return inavalid token response when decoded is false.
        if(!decoded){
            return res.json({msg: "invalid token!"});
        } 
        //get user's id from decoded varable that is passed when token generated.
        const userid = decoded.userId;
        //get the existing user by their id and capture in existUser variabe.
        const existUser = await UserModel.findById(userid);
        //return user not found response when existUser is false.
        if(!existUser){
            return res.json({msg: "User not found!"});
        }
        //add new book in the book model with userid and capture in the newBook variable.
        const newBook = await BookModel({title, status, rating, userid:userid});
        // check if same book is already exist in data base then return response.
        const existBook = await BookModel.findOne({title});
        if(existBook){
            res.json({msg: "Book Already added !"});
            return;
        }
        //save the book to the data base and return a confirmation message with added book.
        await newBook.save();
        return res.json({msg: "Book added Successfully!", book: newBook});
    } 
    //retun any error in the process.
    catch (err) {
        console.log("catch error", err);
    }

})


//asyncronous function to get book data.
myBookRouter.get("/myBooks", async(req, res) => {

    //add pagination facility to get 12 item per page.
    const page = (req.query._page || 1);
    const perPage = (req.query._perPage || 12)

    //get token from req.headers.authorization and store in the variable token.
    const token = req.headers.authorization?.split(" ")[1];

    //try and catch block to catch any error.
    try {
        //return please login response if token not found.
        if(!token){
            return res.json({msg: "Please Login!"});
        }

        //verify token and store data in variable decoded.
        const decoded = jwt.verify(token, "my_book");

        //check res with invalid token if verify fails.
        if(!decoded){
            return res.json({msg: "invalid token!"});
        }

        //get id from decoded and store in the variable userid.
        const userid = decoded.userId;

        //get exist user user data by id and store in the variable existUser.
        const existUser = await UserModel.findById(userid);

        //check and return user not found response if user not exist.
        if(!existUser){
            return res.json({msg: "User not found!"});
        }
        //check the user role and give authority accordingly.
        if(existUser.role === "admin"){
            //get the exist book from book data base and populate its user and store in the variable existBook.
            const existBook = await BookModel.find().populate("user");
            //check and return book not found response if my_book not exist.
            if(!existBook){
                return res.json({msg: "Book not found!"});
            } 
            //send book data in response.
            return res.json({book: existBook});
        }
        //check the user role and give authority accordingly.
        if(existUser.role === "user"){
            //get the exist book from book data base and store in the variable existBook.
            const existBook = await BookModel.find({userid});
            //check and return book not found response if book not exist.
            if(!existBook){
                return res.json({msg: "Book not found!"});
            } 
            //send bookdata in response.
            return res.json({book: existBook});
        }
        else{
            //return not authorized response.
            return res.json({msg: "you are not authorized!"});
        }
    } 
    catch (err) {
        //log any error catched by catch block.
        return console.log("catch error", err);
    }
})

//asyncronous function to updae book data.
myBookRouter.patch("/bookUpdate/:id", async(req, res) => {

    //get token from req.headers.authorization and store in the variable token.
    const token = req.headers.authorization?.split(" ")[1];

    // destructure id from req params.
    const {id} = req.params;

    //destructure my_book info from req body.
    const {status, rating} = req.body;

    //try and catch block to catch any errors.
    try {
        //return please login response if token not found.
        if(!token){
            return res.json({msg: "Please Login!"});
        }
        //verify token and store data in variable decoded.
        const decoded = jwt.verify(token, "my_book");

        //check res with invalid token if verify fails.
        if(!decoded){
            return res.json({msg: "invalid token!"});
        }
        //get id from decoded and store in the variable userid.
        const userid = decoded.userId;

        //get exist user user data by id and store in the variable existUser.
        const existUser = await UserModel.findById(userid);

        //check and return user not found response if user not exist.
        if(!existUser){
            return res.json({msg: "User not found!"});
        }
        //check the user role and give authority accordingly.
        if(existUser.role === "user"){
            //get the exist book from book data base and store in the variable existBook.
            const existBook = await BookModel.findById(id);

            //check and return book not found response if book not exist.
            if(!existBook){
                return res.json({msg: "Book not found!"});
            }
            //veryfy that user can only update their book profile.
            if(existUser._id.toString() === existBook.userid.toString()){
                // find book from book model and update and save again.
                const updateBook = await BookModel.findByIdAndUpdate(id, {status, rating}, {new:false});
                //return updated book data in response.
                return res.json({msg: "Book updated successfully!", updateBook});
            }
            else{
                //return not authorized response.
                return res.json({msg: "you are not authorized!"})
            }
        }
        //check the user role and give authority accordingly.
        else if(existUser.role === "admin"){
            // find book from recice model and update and save again.
            const updateBook = await BookModel.findByIdAndUpdate(id, {status, rating}, {new:false});
            //return updated book data in response.
            return res.json({msg: "Book updated successfully!", updateBook});
        }
        else{
            //return not authorized response.
            return res.json({msg: "You are not authorized!"});
        }
    } 
    catch (err) {
        //log any error catched by catch block.
        console.log("catch error", err);
    }
})

module.exports = {myBookRouter};
