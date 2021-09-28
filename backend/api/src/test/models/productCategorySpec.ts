import { ProductCategory, ModelProductCategory } from '../../models/ProductCategory';

const model = new ModelProductCategory();

describe("Product Category Model", () => {
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

    it('create method should add a Product Category', async () => {
        const result = await model.create({
            id: 0,
            category: 'category1'
        });
        expect(result).toEqual({
            id: 1,
            category: 'category1'
        });
    });

    it('index method should return a list of product categories', async () => {
        const result = await model.index();
        expect(result).toEqual([{
            id: 1,
            category: 'category1'
        }]);
    });

    it('show method should return the correct product category', async () => {
        const result = await model.show(1);
        expect(result).toEqual({
            id: 1,
            category: 'category1'
        });
    });

    it('update method should update a product category', async () => {
        const result = await model.update({
            id: 1,
            category: 'category1update'
        });
        expect(result).toEqual({
            id: 1,
            category: 'category1update'
        });
    });

    it('delete method should remove the product category', async () => {
        model.delete(1);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});