"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../../models/product");
const productCategory_1 = require("../../models/productCategory");
describe("Product Model", () => {
    const model = new product_1.ModelProduct();
    // create product categories
    const modelProductCategory = new productCategory_1.ModelProductCategory();
    let category1;
    let category2;
    let product1;
    let product2;
    beforeAll(async () => {
        category1 = await modelProductCategory.create({
            id: 0,
            category: 'category1'
        });
        category2 = await modelProductCategory.create({
            id: 0,
            category: 'category2'
        });
    });
    afterAll(async () => {
        await modelProductCategory.delete(category1.id);
        await modelProductCategory.delete(category2.id);
    });
    it('create method should add a product', async () => {
        product1 = await model.create({
            id: 0,
            product_name: 'product',
            price: 123456,
            category: category1.id
        });
        expect(product1).toEqual({
            id: product1.id,
            product_name: 'product',
            price: 123456,
            category: category1.id
        });
    });
    it('create method should add a product (2nd)', async () => {
        product2 = await model.create({
            id: 0,
            product_name: 'product2',
            price: 123456,
            category: category2.id
        });
        expect(product2).toEqual({
            id: product2.id,
            product_name: 'product2',
            price: 123456,
            category: category2.id
        });
    });
    it('index method should return a list of products', async () => {
        const result = await model.index(-1);
        expect(result.length).toEqual(2);
    });
    it('index method should return a list of product with category', async () => {
        const result = await model.index(category2.id);
        expect(result).toEqual([product2]);
    });
    it('show method should return the correct product', async () => {
        const result = await model.show(product1.id);
        expect(result).toEqual(product1);
    });
    it('update method should update a product fields', async () => {
        const result = await model.update({
            id: product1.id,
            product_name: 'product_update',
            price: 123457,
            category: product1.category
        });
        expect(result).toEqual({
            id: product1.id,
            product_name: 'product_update',
            price: 123457,
            category: product1.category
        });
    });
    it('delete method should remove the product', async () => {
        await model.delete(product1.id);
        await model.delete(product2.id);
        const result = await model.index(-1);
        expect(result).toEqual([]);
    });
});
