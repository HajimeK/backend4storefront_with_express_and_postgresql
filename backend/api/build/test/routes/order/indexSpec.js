"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../../server");
const orderStatus_1 = require("../../../models/orderStatus");
const product_1 = require("../../../models/product");
const productCategory_1 = require("../../../models/productCategory");
const user_1 = require("../../../models/user");
// Order
describe('Test suite for /order', () => {
    const modelProductCategory = new productCategory_1.ModelProductCategory();
    const modelOrderStatus = new orderStatus_1.ModelOrderStatus();
    const modelProduct = new product_1.ModelProduct();
    const modelUser = new user_1.ModelUser();
    let category;
    let status;
    let status_update;
    let product1;
    let product2;
    let oi;
    let user;
    let token;
    const req = (0, supertest_1.default)(server_1.app);
    beforeAll(async () => {
        // create a product category
        category = await modelProductCategory.create({
            id: 0,
            category: 'category1'
        });
        // create a order status
        status = await modelOrderStatus.create({
            id: 0,
            status: 'active'
        });
        status_update = await modelOrderStatus.create({
            id: 0,
            status: 'completed'
        });
        // create a product 1
        product1 = await modelProduct.create({
            id: 0,
            name: 'product1',
            price: 123456,
            category: category.id
        });
        // create a product 2
        product2 = await modelProduct.create({
            id: 0,
            name: 'product2',
            price: 123456,
            category: category.id
        });
        oi = [
            { id: 0, product_id: product1.id, quantity: 10 },
            { id: 0, product_id: product2.id, quantity: 10 }
        ];
        // create a user
        user = await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        });
        // login to get auth token
        const login = await req.post('/user/login').send({ email: 'email@something.com', password: 'Pass' });
        token = login.body.token;
    });
    afterAll(async () => {
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
    it('/order/create create method should add an order', async () => {
        await req.post('/order/create')
            .set('Authorization: ', `Bearer ${token}`)
            .send({
            id: 0,
            user_id: user.id,
            order_status_id: status_update.id,
            item: oi
        })
            .expect(200)
            .expect((response) => {
            expect(response.body)
                .toEqual({
                id: 1,
                user_id: user.id,
                order_status_id: status_update.id,
                item: oi
            });
        });
    });
    it('/order/index/1 index method should return a list of order for user', async () => {
        await req.get(`/order/index/${user.id}`)
            .set('Authorization: ', `Bearer ${token}`)
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
            ]);
        });
    });
    it('/order/index/1?status=2 index method should return a list of order for user with completed', async () => {
        await req.get(`/order/index/${user.id}?status=${status_update.id}`)
            .set('Authorization: ', `Bearer ${token}`)
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
            ]);
        });
    });
    it('/order/show/1 show method should return the correct order', async () => {
        await req.get(`/order/show/1`)
            .set('Authorization: ', `Bearer ${token}`)
            .expect(200)
            .expect((response) => {
            expect(response.body)
                .toEqual({
                id: 1,
                user_id: user.id,
                order_status_id: status_update.id,
                item: oi
            });
        });
    });
    it('/order/delete delete method should remove the order', async () => {
        await req
            .delete('/order/1')
            .expect(200);
        await req
            .get('/product/index')
            .expect(200)
            .expect((response) => {
            expect(response.body)
                .toEqual([]);
        });
    });
});
