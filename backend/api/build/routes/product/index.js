"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../../models/product");
const auth_1 = require("../util/auth");
const product = express_1.default.Router();
product.use(express_1.default.urlencoded({
    extended: true
}));
product.use(express_1.default.json());
const model = new product_1.ModelProduct();
product.get('/index', async (request, response) => {
    try {
        let category = -1;
        if (request.query.category !== 'undefined') {
            category = parseInt(request.query.category);
        }
        const products = await model.index(category);
        return response.status(200).send(products);
    }
    catch (error) {
        return response.status(400).send(`Could not get books. Error: ${error.message}`);
    }
});
product.get('/show/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const p = await model.show(id);
        return response.status(200).send(p);
    }
    catch (error) {
        return response.status(400).send(`Could not get a user. Error: ${error.message}`);
    }
});
product.post('/create', auth_1.verifyAuthToken, async (request, response) => {
    const p = request.body;
    console.log(p);
    try {
        const p_created = await model.create(p);
        return response.status(200).send(p_created);
    }
    catch (error) {
        return response.status(400).send(`Could not create a product ${p.product_name}. Error: ${error.message}`);
    }
});
product.delete('/:id', auth_1.verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const product = await model.delete(id);
        return response.status(200).send(product);
    }
    catch (error) {
        return response.status(400).send(`Could not create a product ${id}. Error: ${error.message}`);
    }
});
exports.default = product;
