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
/*
* /product/index?top=<true | false>&num=<number(default 5)>?category=<catetory>
*
* @param {boolean} top: [Optional]true to get top. If not specified
* @param {number} num: [Optional] Only work with top.The numbe of items to get. Default value is 5.
* @param {string} category: [Optional] the product category. The category should match that are stored in the category table.
* @return {json array} list of products
*        [ id :{
*                  product_name: <{string} product name>,
*                  price: <{number} >
*              },
*           ...]
*/
product.get('/index', (request, response) => {
    const category = parseInt(request.query.category);
    const top = request.query.top == "true";
    const num = parseInt(request.query.num);
    model.index(category, top, num)
        .then(products => {
        return response.status(200).send(products);
    })
        .catch(error => {
        return response.status(400).send(`Could not get books. Error: ${error.message}`);
    });
});
/*
* /product/show?id=<product id>
*
* @param {number} id:
* @return {json array} list of products
*        [ id :{
*                  product_name: <{string} product name>,
*                  price: <{number} >
*              },
*           ...]
*/
product.get('/show/:id', (request, response) => {
    const id = parseInt(request.params.id);
    model.show(id)
        .then(product => {
        return response.status(200).send(product);
    })
        .catch(error => {
        return response.status(400).send(`Could not get books. Error: ${error.message}`);
    });
});
/*
* /product/create
*
* @param {Product} : Pass the product in the reuqest body.
* @return {json array} list of products
*        [ id :{
*                  product_name: <{string} product name>,
*                  price: <{number} >
*              },
*           ...]
*/
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
