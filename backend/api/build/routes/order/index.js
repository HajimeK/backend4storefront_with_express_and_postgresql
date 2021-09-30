"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../../models/order");
const auth_1 = require("../util/auth");
const order = express_1.default.Router();
order.use(express_1.default.urlencoded({
    extended: true
}));
order.use(express_1.default.json());
const model = new order_1.ModelOrder();
order.get('/index/:user', auth_1.verifyAuthToken, async (request, response) => {
    try {
        const user = parseInt(request.params.user);
        if (typeof request.query.status !== 'undefined') {
            const status = parseInt(request.query.status);
            const orders = await model.index(user, status);
            return response.status(200).send(orders);
        }
        else {
            const orders = await model.index(user);
            return response.status(200).send(orders);
        }
    }
    catch (error) {
        return response.status(400).send(`Could not get orders. Error: ${error.message}`);
    }
});
order.get('/show/:id', (request, response) => {
    const id = parseInt(request.params.id);
    model.show(id)
        .then(() => {
        return response.status(200).send(order);
    })
        .catch(error => {
        return response.status(400).send(`Could not get an order ${id}. Error: ${error.message}`);
    });
});
order.post('/create', auth_1.verifyAuthToken, async (request, response) => {
    const order = request.body;
    try {
        const order_created = await model.create(order);
        return response.status(200).send(order_created);
    }
    catch (error) {
        return response.status(400).send(`Could not create an order ${order.id}. Error: ${error.message}`);
    }
});
order.delete('/:id', auth_1.verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const order = await model.delete(id);
        return response.status(200).send(order);
    }
    catch (error) {
        return response.status(400).send(`Could not delete order ${id}. Error: ${error.message}`);
    }
});
exports.default = order;
