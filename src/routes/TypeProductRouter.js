const express = require("express");
const router = express.Router();
const TypeProductController = require("../controllers/TypeProductController");

router.get("/getall", TypeProductController.getAllType);

module.exports = router;
