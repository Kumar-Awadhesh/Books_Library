// impot mongoose to create schema.
const mongoose = require("mongoose");

// create books schema.
const myBookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    status: {type: String, required: true, },
    rating: {type: Number, required: true},
    userid: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}
},{
    // prevent the version control of application.
    versionKey: false,
})

//crate refference, user to books.
myBookSchema.virtual("user", {
    ref: "user",
    localField: "userid", //books's userid.
    foreignField: "_id", //user's id.
    justOne: true //to show single user/object of user
})

//create book model and export.
const BookModel = mongoose.model("my_book", myBookSchema);
module.exports = {BookModel};