"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../models/user");
const auth_1 = require("../util/auth");
dotenv_1.default.config();
const user = express_1.default.Router();
user.use(express_1.default.urlencoded({
    extended: true
}));
user.use(express_1.default.json());
const model = new user_1.ModelUser();
user.get('/index', auth_1.verifyAuthToken, async (request, response) => {
    try {
        const users = await model.index();
        return response.status(200).send(users);
    }
    catch (error) {
        return response.status(400).send(`Could not get users. Error: ${error.message}`);
    }
});
user.get('/show/:id', auth_1.verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const p = await model.show(id);
        return response.status(200).send(p);
    }
    catch (error) {
        return response.status(400).send(`Could not get a user. Error: ${error.message}`);
    }
});
user.post('/create', auth_1.verifyAuthToken, async (request, response) => {
    const u = request.body;
    console.log(u);
    try {
        const u_created = await model.create(u);
        return response.status(200).send(u_created);
    }
    catch (error) {
        return response.status(400).send(`Could not create a user ${u.firstname} ${u.lastname}. Error: ${error.message}`);
    }
});
user.delete('/:id', auth_1.verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const user = await model.delete(id);
        return response.status(200).send(user);
    }
    catch (error) {
        return response.status(400).send(`Could not delete a user ${id}. Error: ${error.message}`);
    }
});
user.post('/login', (request, response) => {
    const credential = request.body;
    if (!credential || !credential.email || !credential.password) {
        return response.status(400).send('Missing email/password in request body');
    }
    model.authenticate(credential.email, credential.password)
        .then(user => {
        if (user && user.id) {
            const { TOKEN_SECRET } = process.env;
            response.status(200).send({
                email: user.email,
                token: jsonwebtoken_1.default.sign(user.email, TOKEN_SECRET)
            });
        }
        else {
            response.status(401).send('Invalid user credentials');
        }
    })
        .catch(error => {
        return response.status(400).send(`Login Failure. Error: ${error.message}`);
    });
});
exports.default = user;
