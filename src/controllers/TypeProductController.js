const TypeProductService = require("../service/TypeProduct");

const getAllType = async (req, res) => {
  try {
    const response = await TypeProductService.getAllTypeProduct();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  getAllType,
};
