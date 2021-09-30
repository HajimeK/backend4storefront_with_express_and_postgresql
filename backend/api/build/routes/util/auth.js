"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Load configs
dotenv_1.default.config();
const { TOKEN_SECRET } = process.env;
function verifyAuthToken(request, response, next) {
    try {
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        }
        else {
            throw Error('Missing Token, it is reuired in your request');
        }
        next();
    }
    catch (error) {
        response
            .status(401)
            .send(`${error.message}`);
    }
}
exports.verifyAuthToken = verifyAuthToken;
