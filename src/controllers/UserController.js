const userService = require("../service/UserService");
const jwtService = require("../service/JwtService");

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Vui lòng nhập đầy đủ thông tin",
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Email chưa đúng định dạng",
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Mật khẩu không khớp",
            });
        }
        const response = await userService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            message: e,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const response = await userService.changePassWord(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            message: e,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        if (!email || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "Vui lòng nhập đầy đủ thông tin",
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Email không đúng định dạng",
            });
        }
        const response = await userService.loginUser(req.body);
        const { refresh_token, ...newReponse } = response;
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
        });
        return res.status(200).json({ ...newReponse, refresh_token });
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "Vui lòng đăng nhập",
            });
        }
        const response = await userService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "Vui lòng đăng nhập",
            });
        }
        const response = await userService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const response = await userService.getAllUser(
            Number(limit) || null,
            Number(page) || 0,
            sort,
            filter
        );
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }
        const response = await userService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(" ")[1];
        if (!token) {
            return res.status(200).json({
                status: "ERR",
                message: "The token is required",
            });
        }
        const response = await jwtService.refreshTokenJwtService(token);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("refresh_token");
        return res.status(200).json({
            status: "OK",
            message: "Logout successfully",
        });
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    changePassword,
};
