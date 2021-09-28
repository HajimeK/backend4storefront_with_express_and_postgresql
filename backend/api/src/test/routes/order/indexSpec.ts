import request from 'supertest';
import { app } from '../../../server';
import { ModelOrderStatus } from '../../../models/orderStatus';
import { ModelProduct } from '../../../models/product';
import { ModelProductCategory } from '../../../models/productCategory';
import { ModelUser } from '../../../models/user';

const modelProductCategory = new ModelProductCategory();
const modelOrderStatus = new ModelOrderStatus();
const modelProduct = new ModelProduct();
const modelUser = new ModelUser();

const req = request(app);

// Order
describe('Test suite for /order', async () => {

    // create a product category
    const category = await modelProductCategory.create({
        id: 0,
        category: 'category1'
    });
    // create a order status
    const status = await modelOrderStatus.create({
        id: 0,
        status: 'active'
    });
    const status_update = await modelOrderStatus.create({
        id: 0,
        status: 'completed'
    });
    // create a product 1
    const product1 = await modelProduct.create({
        id: 0,
        name: 'product1',
        price: 123456,
        category: category.id
    });
    // create a product 2
    const product2 = await modelProduct.create({
        id: 0,
        name: 'product2',
        price: 123456,
        category: category.id
    });

    const oi = [
        {id: 0, product_id: product1.id, quantity: 10},
        {id: 0, product_id: product2.id, quantity: 10}
    ];
    const oi_update = [
        {id: 0, product_id: product1.id, quantity: 20},
        {id: 0, product_id: product2.id, quantity: 20}
    ];

    // create a user
    const user = await modelUser.create({
        id: 0,
        email: 'email@something.com',
        firstName: 'First',
        lastName: 'Last',
        password: 'Pass'
    });

    // login to get auth token
    const login = await req.post('/user/login').send({email: 'email@something.com', password: 'Pass'});

    it('/order/create create method should add an order', async () => {
        await req.post('/order/create')
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .send(
                {
                    id: 0,
                    user_id: user.id,
                    order_status_id: status_update.id,
                    item: oi
                }
            )
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual(
                    {
                        id: 1,
                        user_id: user.id,
                        order_status_id: status_update.id,
                    item: oi
                    }
                );
            });
    });

    it('/order/index/1 index method should return a list of order for user', async () => {
        await req.get(`/order/index/${user.id}`)
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual([
                        {
                            id: 1,
                            user_id: user.id,
                            order_status_id: status_update.id,
                            item: oi
                        }
                    ]
                );
            });
    });

    it('/order/index/1?status=2 index method should return a list of order for user with completed', async () => {
        await req.get(`/order/index/${user.id}?status=${status_update.id}`)
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual([
                        {
                            id: 1,
                            user_id: user.id,
                            order_status_id: status_update.id,
                            item: oi
                        }
                    ]
                );
            });
    });

    it('/order/show/1 show method should return the correct order', async () => {
        await req.get(`/order/show/1`)
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual(
                        {
                            id: 1,
                            user_id: user.id,
                            order_status_id: status_update.id,
                            item: oi
                        }
                );
            });
    });

    it('/order/delete delete method should remove the order', async () => {
        await req
            .delete('/order/1')
            .expect(200);
        await req
            .get('/product/index')
            .expect(200)
            .expect ( (response) => {
                expect(response.body)
                .toEqual([]);
            });
    });

    // delete a user
    await modelUser.delete(user.id);
    // delete a product
    await modelProduct.delete(product2.id);
    // delete a product
    await modelProduct.delete(product1.id);
    // delete a order status
    await modelOrderStatus.delete(status.id);
    // delete a product category
    await modelProductCategory.delete(category.id);
});