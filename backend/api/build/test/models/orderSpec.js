"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../models/order");
const orderStatus_1 = require("../../models/orderStatus");
const product_1 = require("../../models/product");
const productCategory_1 = require("../../models/productCategory");
const user_1 = require("../../models/user");
describe("Product Model", () => {
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
    let oi;
    let oi_update;
    let user;
    beforeAll(async () => {
        // create a product category
        await modelProductCategory.create({
            id: 0,
            category: 'category1'
        });
        category = await modelProductCategory.show(1);
        // create a order status
        await modelOrderStatus.create({
            id: 0,
            status: 'status1'
        });
        status = await modelOrderStatus.show(1);
        await modelOrderStatus.create({
            id: 0,
            status: 'status2'
        });
        status_update = await modelOrderStatus.show(2);
        // create a product 1
        await modelProduct.create({
            id: 0,
            name: 'product1',
            price: 123456,
            category: category.id
        });
        product1 = await modelProduct.show(1);
        // create a product 2
        await modelProduct.create({
            id: 0,
            name: 'product2',
            price: 123456,
            category: category.id
        });
        product2 = await modelProduct.show(2);
        oi = [
            { id: 0, product_id: product1.id, quantity: 10 },
            { id: 0, product_id: product2.id, quantity: 10 }
        ];
        oi_update = [
            { id: 0, product_id: product1.id, quantity: 20 },
            { id: 0, product_id: product2.id, quantity: 20 }
        ];
        // create a user
        await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        });
        user = await modelUser.show(1);
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
    it('create method should add an order', async () => {
        const result = await model.create({
            id: 0,
            user_id: user.id,
            order_status_id: status.id,
            item: oi
        });
        expect(result).toEqual({
            id: 1,
            user_id: user.id,
            order_status_id: status.id,
            item: oi
        });
    });
    it('index method should return a list of order', async () => {
        const result = await model.index(user.id, status.id);
        expect(result).toEqual([{
                id: 1,
                user_id: user.id,
                order_status_id: status.id,
                item: oi
            }]);
    });
    it('show method should return the correct order', async () => {
        const result = await model.show(1);
        expect(result).toEqual({
            id: 1,
            user_id: user.id,
            order_status_id: status.id,
            item: oi
        });
    });
    it('update method should update an order status', async () => {
        const result = await model.update({
            id: 1,
            user_id: user.id,
            order_status_id: status_update.id,
            item: oi
        });
        expect(result).toEqual({
            id: 1,
            user_id: user.id,
            order_status_id: status_update.id,
            item: oi
        });
    });
    it('update method should update an order item', async () => {
        const result = await model.update({
            id: 1,
            user_id: user.id,
            order_status_id: status_update.id,
            item: oi_update
        });
        expect(result).toEqual({
            id: 1,
            user_id: user.id,
            order_status_id: status_update.id,
            item: oi_update
        });
    });
    it('delete method should remove the order', async () => {
        await model.delete(1);
        const result = await model.index(user.id);
        expect(result).toEqual([]);
    });
});
