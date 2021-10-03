import request from 'supertest';
import app from '../../../server';
import { ModelOrderStatus, OrderStatus } from '../../../models/orderStatus';
import { ModelProduct, Product } from '../../../models/product';
import { ModelProductCategory, ProductCategory } from '../../../models/productCategory';
import { ModelUser, User } from '../../../models/user';
import { OrderItem } from '../../../models/orderItem';
import { loginToken } from '../../../routes/user';
import { Order } from '../../../models/order';

// Order
describe('Test suite for /order', () => {

    const modelProductCategory = new ModelProductCategory();
    const modelOrderStatus = new ModelOrderStatus();
    const modelProduct = new ModelProduct();
    const modelUser = new ModelUser();
    let category: ProductCategory;
    let order_status: OrderStatus;
    let status_update: OrderStatus;
    let product1: Product;
    let product2: Product;
    let oi: OrderItem[];
    let user: User;
    let token: string;
    let orderid = 0;

    const req = request(app);

    beforeAll(async () => {
        // create a product category
        category = await modelProductCategory.create({
            id: 0,
            category: 'category1'
        });
        // create a order status
        order_status = await modelOrderStatus.create({
            id: 0,
            order_status: 'active'
        });
        status_update = await modelOrderStatus.create({
            id: 0,
            order_status: 'completed'
        });
        // create a product 1
        product1 = await modelProduct.create({
            id: 0,
            product_name: 'product1',
            price: 123456,
            category: category.id
        });
        // create a product 2
        product2 = await modelProduct.create({
            id: 0,
            product_name: 'product2',
            price: 123456,
            category: category.id
        });

        oi = [
            {id: 0, apporder: 0, product: product1.id, quantity: 10},
            {id: 0, apporder: 0, product: product2.id, quantity: 10}
        ];

        // create a user
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
    })

    afterAll(async () => {
        // delete a user
        await modelUser.delete(user.id);
        // delete a product
        await modelProduct.delete(product2.id);
        // delete a product
        await modelProduct.delete(product1.id);
        // delete a order status
        await modelOrderStatus.delete(order_status.id);
        // delete a product category
        await modelProductCategory.delete(category.id);
    })

    it('/order/create create method should add an order', async () => {
        await req.post('/order/create')
            .auth(token, {type: 'bearer'})
            .send(
                {
                    id: 0,
                    appuser: user.id,
                    order_status: order_status.id
                }
            )
            .expect(200)
            .expect((response) => {
                const order = response.body as Order;
                expect(order.appuser).toBe(user.id);
                expect(order.order_status).toBe(order_status.id);
                orderid = order.id;
            });
    });

    it(`/order/index/userid index method should return a list of order for user`, async () => {
        await req.get(`/order/index/${user.id}`)
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect((response) => {
                const orders = response.body as Order[];
                expect(orders.length).toBe(1);
            });
    });

    it('/order/index/1?status=2 index method should return a list of order for user with completed', async () => {
        await req.get(`/order/index/${user.id}?status=${order_status.id}`)
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect((response) => {
                const order = response.body as Order[];
                expect(order[0].appuser).toBe(user.id);
                expect(order[0].order_status).toBe(order_status.id);
            });
    });

    it(`/order/show/${orderid} show method should return the correct order`, async () => {
        await req.get(`/order/show/${orderid}`)
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect((response) => {
                const order = response.body as Order;
                expect(order.appuser).toBe(user.id);
                expect(order.order_status).toBe(order_status.id);
            });
    });

    it('/order/delete delete method should remove the order', async () => {
        await req
            .delete(`/order/${orderid}`)
            .auth(token, {type: 'bearer'})
            .expect(200);
    });
});