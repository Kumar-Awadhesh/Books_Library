// impot mongoose to create schema.
const mongoose = require("mongoose");

// create books schema.
const bookSchema = new mongoose.Schema({
    image: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    availability: {type: String, enum:["true", "false"], default: "true", required: true},
},{
    // prevent the version control of application.
    versionKey: false,
})

//create book model and export.
const BookModel = mongoose.model("book", bookSchema);
module.exports = {BookModel};