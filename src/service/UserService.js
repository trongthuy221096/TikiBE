const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "Email đã tồn tại",
                });
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "Đăng ký thành công",
                    data: createdUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const changePassWord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: data.id,
            });
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            const match = await bcrypt.compare(
                data.password,
                checkUser.password
            );
            if (!match) {
                resolve({
                    status: "ERR",
                    message: "Mật khẩu hiện tại không đúng",
                });
            }
            const hash = bcrypt.hashSync(data.newpassword, 10);
            const updatedUser = await User.findOneAndUpdate(
                { _id: data.id },
                { password: hash },
                {
                    new: true,
                }
            );

            resolve({
                status: "OK",
                message: "Cập nhập thành công",
                data: updatedUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            const comparePassword = bcrypt.compareSync(
                password,
                checkUser.password
            );

            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: "OK",
                message: "Đăng nhập thành công",
                access_token,
                refresh_token,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id,
            });

            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            const updatedUser = await User.findOneAndUpdate({ _id: id }, data, {
                new: true,
            });
            resolve({
                status: "OK",
                message: "Cập nhập thành công",
                data: updatedUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id,
            });
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            await User.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Xóa thành công",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalUser = await User.estimatedDocumentCount();
            let allUser = [];
            if (filter) {
                const label = filter[0];
                let query = {};
                if (label === "birthday") {
                    const date = new Date(filter[1]);
                    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
                    const endOfDay = new Date(
                        date.setUTCHours(23, 59, 59, 999)
                    );
                    query[label] = { $gte: startOfDay, $lte: endOfDay };
                } else {
                    query[label] = { $regex: filter[1] };
                }

                const allObjectFilter = await User.find(query)
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });
                totalUser = allObjectFilter.length;
                resolve({
                    status: "OK",
                    message: "Success",
                    data: allObjectFilter,
                    total: totalUser,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalUser / limit),
                });
            }
            if (!limit) {
                allUser = await User.find().sort({
                    createdAt: -1,
                    updatedAt: -1,
                });
            } else {
                allUser = await User.find()
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });
            }
            resolve({
                status: "OK",
                message: "Success",
                data: allUser,
                total: totalUser,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalUser / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id,
            });
            if (user === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }
            resolve({
                status: "OK",
                message: "SUCESS",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    changePassWord,
};
