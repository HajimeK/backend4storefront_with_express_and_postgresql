"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
const productCategory_1 = require("../../../models/productCategory");
const user_1 = require("../../../models/user");
describe('Test Suite for /product', () => {
    const req = (0, supertest_1.default)(server_1.default);
    const modelProductCategory = new productCategory_1.ModelProductCategory();
    const modelUser = new user_1.ModelUser();
    let category1;
    let category2;
    let user;
    let token;
    let product1id = 0;
    let product2id = 0;
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
        const login = await req.post('/user/login').send({ email: 'email@something.com', password: 'Pass' });
        token = login.body.token;
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
            .auth(token, { type: 'bearer' })
            .send({
            id: 0,
            product_name: 'product1',
            price: 123456,
            category: category1.id
        })
            .expect(200)
            .expect((response) => {
            const product = response.body;
            expect(product.product_name).toBe('product1');
            expect(product.price).toBe(123456);
            product1id = product.id;
        });
    });
    it('/product/create create method should add a product (2nd)', async () => {
        await req
            .post('/product/create')
            .auth(token, { type: 'bearer' })
            .send({
            id: 0,
            product_name: 'product2',
            price: 123456,
            category: category2.id
        })
            .expect(200)
            .expect((response) => {
            const product = response.body;
            expect(product.product_name).toBe('product2');
            expect(product.price).toBe(123456);
            expect(product.category).toBe(category2.id);
            product2id = product.id;
        });
    });
    // - Inex
    // - [OPTIONAL] Top 5 most popular products
    // - [OPTIONAL] Products by category (args: product category)
    it('/product/index', async () => {
        await req
            .get('/product/index')
            .expect(200)
            .expect((response) => {
            const products = response.body;
            expect(products.length).toBe(2);
        });
    });
    it(`/product/index?category=1`, async () => {
        await req
            .get(`/product/index?category=${category2.id}`)
            .expect(200)
            .expect((response) => {
            const products = response.body;
            expect(products.length).toBe(1);
        });
    });
    // - Show
    it('/product/show/2', async () => {
        await req
            .get(`/product/show/${product1id}`)
            .expect(200)
            .expect((response) => {
            expect(response.body)
                .toEqual({
                id: product1id,
                product_name: 'product1',
                price: 123456,
                category: category1.id
            });
        });
    });
    // - Delete
    it('/product/delete', async () => {
        await req
            .delete(`/product/${product1id}`)
            .auth(token, { type: 'bearer' })
            .expect(200);
        await req
            .delete(`/product/${product2id}`)
            .auth(token, { type: 'bearer' })
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
