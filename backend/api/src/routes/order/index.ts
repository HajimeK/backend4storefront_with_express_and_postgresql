import express, { Request, Response }  from 'express';
import { ModelOrder, Order } from '../../models/order';
import { verifyAuthToken } from '../util/auth';

const order =  express.Router();
order.use(
    express.urlencoded({
        extended: true
    })
)
order.use(express.json());

const model = new ModelOrder();

order.get('/index/:user', verifyAuthToken, async (request: Request, response: Response) => {
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
        return response.status(400).send(`Could not get orders. Error: ${(error as Error).message}`);
    }
});

order.get('/show/:id', (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    model.show(id)
    .then(returned => {
        return response.status(200).send(returned);
    })
    .catch(error => {
        return response.status(400).send(`Could not get an order ${id}. Error: ${(error as Error).message}`);
    })
});

order.post('/create', verifyAuthToken, async (request: Request, response: Response) => {
    const order = request.body as Order;
    try {
        const order_created = await model.create(order);

        return response.status(200).send(order_created);
    } catch(error) {
        return response.status(400).send(`Could not create an order ${order.id}. Error: ${(error as Error).message}`);
    }
});

order.delete('/:id', verifyAuthToken, async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    try {
        const order = await model.delete(id);

        return response.status(200).send(order);
    } catch(error) {
        return response.status(400).send(`Could not delete order ${id}. Error: ${(error as Error).message}`);
    }
});

export default order;