import express from 'express';
import { ModelOrder, Order } from '../../models/order';
import { verifyAuthToken } from '../util/auth';

const order =  express.Router();

const model = new ModelOrder();

order.get('/index/:user', verifyAuthToken, async (request, response) => {
    try {
        const user = parseInt(request.params.user);
        if (typeof request.query.status !== 'undefined') {
            const status = parseInt(request.query.status as string);
            const orders = await model.index(user, status);
            return response.status(200).send(orders);
        } else {
            const orders = await model.index(user);
            return response.status(200).send(orders);
        }
    } catch(error) {
        return response.status(400).send(`Could not get orders. Error: ${error}`);
    }
});

order.get('/show/:id', async (request, response) => {
    const id = parseInt(request.params.id as string);
    try {
        const p = await model.show(id);

        return response.status(200).send(p);
    } catch(error) {
        return response.status(400).send(`Could not get an order. Error: ${error}`);
    }
});

order.post('/create', verifyAuthToken, async (request, response) => {
    const order = request.body.product as Order;
    try {
        const order_created = await model.create(order);

        return response.status(200).send(order_created);
    } catch(error) {
        return response.status(400).send(`Could not create an order ${order}. Error: ${error}`);
    }
});

order.delete('/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const order = await model.delete(id);

        return response.status(200).send(order);
    } catch(error) {
        return response.status(400).send(`Could not create a product ${order}. Error: ${error}`);
    }
});

export default order;