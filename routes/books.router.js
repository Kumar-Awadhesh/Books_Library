const express = require("express"); //import express.
const {BookModel} = require("../models/books.model"); // import recipe model from models to access recipe model.

//create books router using express router.
const bookRouter = express.Router();


//asyncronous function to get books data.
bookRouter.get("/books", async(req, res) => {
    
    //try and catch block to catch any error.
    try {
        //add pagination facility to get 12 item per page.
        const page = (req.query._page || 1);
        const perPage = (req.query._perPage || 12)

        //get books and user from data base and store in the variable getbooks.
        const getBook = await BookModel.find();
        //return book data in response.
        return res.json({book: getBook});    
    } 
    catch (err) {
        //log any error if catch.
        console.log("catch error", err);
    }
})

module.exports = {bookRouter};
