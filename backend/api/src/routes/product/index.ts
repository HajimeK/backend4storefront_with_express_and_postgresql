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
product.get('/index', async (request, response) => {
    try {
        const category = parseInt(request.query.category as string);
        const top = request.query.top == "true";
        const num = parseInt(request.query.num as string);
        const p_list = await model.index(category, top, num);

        return response.status(200).send(p_list);
    } catch(error) {
        return response.status(400).send(`Could not get books. Error: ${error}`);
    }
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
product.get('/show/:id', async (request, response) => {
    const id = parseInt(request.params.id as string);
    try {
        const p = await model.show(id);

        return response.status(200).send(p);
    } catch(error) {
        return response.status(400).send(`Could not get books. Error: ${error}`);
    }
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
product.post('/create', verifyAuthToken, async (request, response) => {
    const p = request.body.product as Product;
    console.log(p);
    try {
        const p_created = await model.create(p);

        return response.status(200).send(p_created);
    } catch(error) {
        return response.status(400).send(`Could not create a product ${p}. Error: ${error}`);
    }
});

product.delete('/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const product = await model.delete(id);

        return response.status(200).send(product);
    } catch(error) {
        return response.status(400).send(`Could not create a product ${product}. Error: ${error}`);
    }
});

export default product;