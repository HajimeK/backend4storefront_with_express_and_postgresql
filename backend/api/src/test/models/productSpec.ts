import { Product, ModelProduct } from '../../models/product';
import { ModelProductCategory } from '../../models/productCategory';

const model = new ModelProduct();

describe("Product Model", async () => {
    it('should have an index method', () => {
        expect(model.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(model.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(model.create).toBeDefined();
    });

    it('should have a update method', () => {
        expect(model.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(model.delete).toBeDefined();
    });

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

    it('create method should add a product', async () => {
        const result = await model.create({
            id: 0,
            name: 'product',
            price: 123456,
            category: category1.id
        });
        expect(result).toEqual({
            id: 1,
            name: 'product',
            price: 123456,
            category: category1.id
        });
    });

    it('create method should add a product (2nd)', async () => {
        const result = await model.create({
            id: 0,
            name: 'product2',
            price: 123456,
            category: category2.id
        });
        expect(result).toEqual({
            id: 2,
            name: 'product2',
            price: 123456,
            category: category2.id
        });
    });

    it('index method should return a list of products', async () => {
        const result = await model.index();
        expect(result).toEqual([
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
        ]);
    });

    it('index method should return a list of product with category', async () => {
        const result = await model.index(2);
        expect(result).toEqual([
            {
                id: 2,
                name: 'product2',
                price: 123456,
                category: category2.id
            }
        ]);
    });

    it('show method should return the correct product', async () => {
        const result = await model.show(1);
        expect(result).toEqual({
            id: 1,
            name: 'product',
            price: 123456,
            category: 1
        });
    });

    it('update method should update a product fields', async () => {
        const result = await model.update({
            id: 1,
            name: 'product_update',
            price: 123457,
            category: 1
        });
        expect(result).toEqual({
            id: 1,
            name: 'product_update',
            price: 123457,
            category: 1
        });
    });

    it('delete method should remove the product', async () => {
        model.delete(1);
        model.delete(2);
        const result = await model.index()

        expect(result).toEqual([]);
    });

    // create an entry whose optional field is blank.
    // Also see the id is not re used.
    it('create method with blank optional field should add a product with the optional field blank', async () => {
        const result = await model.create({
            id: 0,
            name: 'product_no_category',
            price: 123456
        });
        expect(result).toEqual({
            id: 2,
            name: 'product_no_category',
            price: 123456
        });
    });

    it('delete method should remove the product', async () => {
        model.delete(2);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});