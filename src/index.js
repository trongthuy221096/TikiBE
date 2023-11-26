const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

dotenv.config();

const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

routes(app);

const db = require("./config/db");
db.connect();

app.listen(port, () => {
    console.log("Sever is running in port: " + port);
});
