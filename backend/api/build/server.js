"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan")); // log output
const helmet_1 = __importDefault(require("helmet")); // secure header
const cors_1 = __importDefault(require("cors")); // Cross-Origine
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const index_1 = __importDefault(require("./routes/product/index"));
const index_2 = __importDefault(require("./routes/user/index"));
const index_3 = __importDefault(require("./routes/order/index"));
// Defind application
exports.app = (0, express_1.default)();
const address = '0.0.0.0:3000';
exports.app.use((0, morgan_1.default)("common"));
exports.app.use((0, helmet_1.default)());
// whitelist
const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
    origin: allowedOrigins
};
exports.app.use((0, cors_1.default)(corsOptions));
// limitter
const limitter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000 // limit each IP to 100 requests per windowMs
});
exports.app.use(limitter);
exports.app.use(express_1.default.json());
// router
exports.app.use('/product', index_1.default);
exports.app.use('/user', index_2.default);
exports.app.use('/order', index_3.default);
exports.app.get('/', function (request, response) {
    response.status(200).send('Receving requests from your IP address:' + request.ip);
});
exports.app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
