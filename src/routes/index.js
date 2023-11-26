const userRouter = require("./UserRoutes");
const productRouter = require("./ProductRouter");
const typeProductRouter = require("./TypeProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");

const routes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/typeproduct", typeProductRouter);
    app.use("/api/order", OrderRouter);
    app.use("/api/payment", PaymentRouter);
};

module.exports = routes;
