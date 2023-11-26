const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1/tiki");
        console.log("connect ok");
    } catch (error) {
        console.log(error);
    }
}
module.exports = { connect };
