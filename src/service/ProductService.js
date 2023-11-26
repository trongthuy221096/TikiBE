const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, rating, description, countInStock } =
            newProduct;
        try {
            const checkProduct = await Product.findOne({
                name: name,
            });
            if (checkProduct !== null) {
                resolve({
                    status: "ERR",
                    message: "Tên sản phẩm đã tồn tại",
                });
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                rating,
                description,
                countInStock,
            });
            if (newProduct) {
                resolve({
                    status: "OK",
                    message: "Tạo sản phẩm thành công",
                    data: newProduct,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id,
            });
            if (checkProduct === null) {
                resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tại",
                });
            }

            const updatedProduct = await Product.findOneAndUpdate(
                { _id: id },
                data,
                {
                    new: true,
                }
            );
            resolve({
                status: "OK",
                message: "Cập nhập thành công",
                data: updatedProduct,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id,
            });
            if (checkProduct === null) {
                resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tại",
                });
            }

            await Product.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Xóa thành công",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });
            resolve({
                status: "OK",
                message: "Xóa thành công",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id,
            });
            if (product === null) {
                resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tjai",
                });
            }

            resolve({
                status: "OK",
                message: "Thành công",
                data: product,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let totalProduct = await Product.estimatedDocumentCount();
            let allProduct = [];
            if (filter) {
                const label = filter[0];
                let query = {};
                if (label === "price" || label === "rating") {
                    query[label] = filter[1];
                } else if (label === "createdAt") {
                    const date = new Date(filter[1]);
                    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
                    const endOfDay = new Date(
                        date.setUTCHours(23, 59, 59, 999)
                    );
                    query[label] = { $gte: startOfDay, $lte: endOfDay };
                } else {
                    query[label] = { $regex: filter[1] };
                }

                const allObjects = await Product.find(query).sort({
                    createdAt: -1,
                    updatedAt: -1,
                });

                totalProduct = allObjects.length;

                const allObjectFilter = await Product.find(query)
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });

                resolve({
                    status: "OK",
                    message: "Success",
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }

            if (!limit) {
                allProduct = await Product.find().sort({
                    createdAt: -1,
                    updatedAt: -1,
                });
            } else {
                allProduct = await Product.find()
                    .limit(limit)
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });
            }
            resolve({
                status: "OK",
                message: "Success",
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalProduct / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct("type");
            resolve({
                status: "OK",
                message: "Success",
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
};
