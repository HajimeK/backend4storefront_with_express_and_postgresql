import request from 'supertest';
import { app } from '../../../server';
import { ModelProductCategory } from '../../../models/productCategory';
import { ModelUser } from '../../../models/user';

const req = request(app);

describe('Test Suite for /product', async () => {

    // preparations for the test
    // create product categories
    const modelProductCategory = new ModelProductCategory();
    const category1 = await modelProductCategory.create({
        id: 0,
        category: 'category1'
    });
    const category2 = await modelProductCategory.create({
        id: 0,
        category: 'category2'
    });
    const modelUser = new ModelUser();
    const user = await modelUser.create({
        id: 0,
        email: 'email@something.com',
        firstName: 'First',
        lastName: 'Last',
        password: 'Pass'
    });

    // login to get auth token
    const login = await req.post('/user/login').send({email: 'email@something.com', password: 'Pass'});

    // - Create [token required]
    it('/product/create create method should add a product (first)', async () => {
        await req
            .post('/product/create')
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .send(
                {
                    id: 0,
                    name: 'product1',
                    price: 123456,
                    category: category1.id
                }
            )
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual(
                    {
                        id: 1,
                        name: 'product1',
                        price: 123456,
                        category: category1.id
                    }
                );
            });
    });

    it('/product/create create method should add a product (2nd)', async () => {
        await req
            .post('/product/create')
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .send(
                {
                    id: 0,
                    name: 'product2',
                    price: 123456,
                    category: category2.id
                }
            )
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual(
                    {
                        id: 2,
                        name: 'product2',
                        price: 123456,
                        category: category2.id
                    }
                );
            });
    });

    // - Inex
    // - [OPTIONAL] Top 5 most popular products
    // - [OPTIONAL] Products by category (args: product category)
    it('/product/index', async () => {
        await req
            .get('/product/index')
            .expect(200)
            .expect ( (response) => {
                expect(response.body)
                .toEqual(
                    [
                        {
                            id: 1,
                            name: 'product',
                            price: 123456,
                            category: category1.id
                        },
                        {
                            id: 2,
                            name: 'product2',
                            price: 123456,
                            category: category2.id
                        }
                    ]
                );
            });
    });

    it('/product/index?category=2', async () => {
        await req
            .get('/product/index?category=2')
            .expect(200)
            .expect ( (response) => {
                expect(response.body)
                .toEqual(
                    [
                        {
                            id: 2,
                            name: 'product2',
                            price: 123456,
                            category: category2.id
                        }
                    ]
                );
            });
    });

    // - Show
    it('/product/show/2', async () => {
        await req
            .get('/product/show/2')
            .expect(200)
            .expect ( (response) => {
                expect(response.body)
                .toEqual(
                    {
                        id: 1,
                        name: 'product1',
                        price: 123456,
                        category: category1.id
                    }
                );
            });
    });

    // - Delete
    it('/product/delete', async () => {
        await req
            .delete('/product/1')
            .expect(200);
        await req
            .delete('/product/2')
            .expect(200);
        await req
            .get('/product/index')
            .expect(200)
            .expect ( (response) => {
                expect(response.body)
                .toEqual([]);
            });
    });

    modelUser.delete(user.id);
    modelProductCategory.delete(category1.id);
    modelProductCategory.delete(category2.id);
});