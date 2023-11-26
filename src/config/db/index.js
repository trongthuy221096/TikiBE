const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb+srv://trantrongthuy221096:hRCJCx9jinOCp4aJ@cluster0.cdyzod3.mongodb.net/?retryWrites=true&w=majority");
        console.log("connect ok");
    } catch (error) {
        console.log(error);
    }
}
module.exports = { connect };
