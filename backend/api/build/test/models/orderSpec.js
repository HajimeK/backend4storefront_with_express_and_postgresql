"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../models/order");
const orderStatus_1 = require("../../models/orderStatus");
const product_1 = require("../../models/product");
const productCategory_1 = require("../../models/productCategory");
const user_1 = require("../../models/user");
describe("Order Model", () => {
    const model = new order_1.ModelOrder();
    const modelProductCategory = new productCategory_1.ModelProductCategory();
    const modelOrderStatus = new orderStatus_1.ModelOrderStatus();
    const modelProduct = new product_1.ModelProduct();
    const modelUser = new user_1.ModelUser();
    let category;
    let status;
    let status_update;
    let product1;
    let product2;
    let user;
    let order;
    beforeAll(async () => {
        // create a product category
        category = await modelProductCategory.create({
            id: 0,
            category: 'category1'
        });
        // create a order status
        status = await modelOrderStatus.create({
            id: 0,
            order_status: 'status1'
        });
        status_update = await modelOrderStatus.create({
            id: 0,
            order_status: 'status2'
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
        // create a user
        user = await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstname: 'First',
            lastname: 'Last',
            password: 'Pass'
        });
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
        await modelOrderStatus.delete(status_update.id);
        // delete a product category
        await modelProductCategory.delete(category.id);
    });
    it('create method should add an order', async () => {
        order = await model.create({
            id: 0,
            appuser: user.id,
            order_status: status.id
        });
        expect(order.appuser).toBe(user.id);
        expect(order.order_status).toBe(status.id);
    });
    it('index method should return a list of order', async () => {
        const result = await model.index(user.id, status.id);
        expect(result).toEqual([order]);
    });
    it('show method should return the correct order', async () => {
        const result = await model.show(order.id);
        expect(result).toEqual(order);
    });
    it('update method should update an order status', async () => {
        const result = await model.update({
            id: order.id,
            appuser: user.id,
            order_status: status_update.id
        });
        expect(result).toEqual({
            id: order.id,
            appuser: user.id,
            order_status: status_update.id
        });
    });
    it('update method should update an order item', async () => {
        const result = await model.update({
            id: order.id,
            appuser: user.id,
            order_status: status_update.id
        });
        expect(result).toEqual({
            id: order.id,
            appuser: user.id,
            order_status: status_update.id
        });
    });
    it('delete method should remove the order', async () => {
        await model.delete(order.id);
        const result = await model.index(user.id);
        expect(result).toEqual([]);
    });
});
