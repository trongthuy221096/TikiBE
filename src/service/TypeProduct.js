const TypeProduct = require("../models/TypeProduct");

const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        let allTypeProduct;
        try {
            allTypeProduct = await TypeProduct.find().sort({
                createdAt: -1,
                updatedAt: -1,
            });
            resolve({
                status: "OK",
                message: "Success",
                data: allTypeProduct,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllTypeProduct,
};
