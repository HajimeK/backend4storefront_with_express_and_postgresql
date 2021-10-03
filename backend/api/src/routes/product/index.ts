import express from 'express';
import { Product, ModelProduct } from '../../models/product';
import { verifyAuthToken } from '../util/auth';

const product =  express.Router()
product.use(
    express.urlencoded({
        extended: true
    })
)
product.use(express.json());

const model = new ModelProduct();

product.get('/index', async (request, response) => {
    try {
        let category = -1;
        if (request.query.category!== 'undefined') {
            category = parseInt(request.query.category as string);
        }
        const products = await model.index(category);

        return response.status(200).send(products);
    } catch(error) {
        return response.status(400).send(`Could not get books. Error: ${(error as Error).message}`);
    }
});

product.get('/show/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const p = await model.show(id);

        return response.status(200).send(p);
    } catch(error) {
        return response.status(400).send(`Could not get a user. Error: ${(error as Error).message}`);
    }
});

product.post('/create', verifyAuthToken, async (request, response) => {
    const p = request.body as Product;
    console.log(p);
    try {
        const p_created = await model.create(p);

        return response.status(200).send(p_created);
    } catch(error) {
        return response.status(400).send(`Could not create a product ${p.product_name}. Error: ${(error as Error).message}`);
    }
});

product.delete('/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const product = await model.delete(id);

        return response.status(200).send(product);
    } catch(error) {
        return response.status(400).send(`Could not create a product ${id}. Error: ${(error as Error).message}`);
    }
});

export default product;