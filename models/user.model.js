// impot mongoose to create schema.
const mongoose = require("mongoose");

// create user schema.
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill valid email"]},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user", required: true},
},{
    // prevent the version control of application.
    versionKey: false,
    //enable the virtuals to refer.
    toJSON: {virtuals: true}
})

//crate refference, user to books.
userSchema.virtual("my_book", {
    ref: "my_book",
    localField: "_id", //user's id.
    foreignField: "userid", //books's userid.
    justOne: false //to show all the books created by user/array of objects of books.
})

//create user model and export.
const UserModel = mongoose.model("user", userSchema);
module.exports = {UserModel};