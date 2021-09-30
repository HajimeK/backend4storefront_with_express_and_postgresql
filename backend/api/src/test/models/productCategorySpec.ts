import { ModelProductCategory } from '../../models/productCategory';

const model = new ModelProductCategory();

describe("Product Category Model", () => {

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
        await model.delete(1);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});