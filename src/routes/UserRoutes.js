const userController = require("../controllers/UserController");

const express = require("express");
const {
    authMiddleWare,
    authUserMiddleWare,
} = require("../middleware/AuthMiddleware");
const router = express.Router();

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
router.get("/getall", userController.getAllUser);
router.post("/changepassword", userController.changePassword);
router.get(
    "/get-details/:id",
    authUserMiddleWare,
    userController.getDetailsUser
);
router.post("/refresh-token", userController.refreshToken);
module.exports = router;
