import request from 'supertest';
import app from '../../../server';
import { ModelProductCategory, ProductCategory } from '../../../models/productCategory';
import { ModelUser, User } from '../../../models/user';
import { loginToken } from '../../../routes/user';

describe('Test Suite for /product', () => {

    const req = request(app);
    const modelProductCategory = new ModelProductCategory();
    const modelUser = new ModelUser();

    let category1: ProductCategory;
    let category2: ProductCategory;
    let user: User;
    let token: string;

    beforeAll(async () => {
        category1 = await modelProductCategory.create({
            id: 0,
            category: 'category1'
        });
        category2 = await modelProductCategory.create({
            id: 0,
            category: 'category2'
        });
        user = await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstname: 'First',
            lastname: 'Last',
            userpassword: 'Pass'
        });
        // login to get auth token
        const login = await req.post('/user/login').send({email: 'email@something.com', password: 'Pass'});
        token = (login.body as loginToken).token;
    });

    afterAll(async () => {
        await modelUser.delete(user.id);
        await modelProductCategory.delete(category1.id);
        await modelProductCategory.delete(category2.id);
    });

    // - Create [token required]
    it('/product/create create method should add a product (first)', async () => {
        await req
            .post('/product/create')
            .auth(token, {type: 'bearer'})
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
            .auth(token, {type: 'bearer'})
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
});