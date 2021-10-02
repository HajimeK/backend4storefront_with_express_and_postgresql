import { ModelProductCategory, ProductCategory } from '../../models/productCategory';

const model = new ModelProductCategory();

describe("Product Category Model", () => {

    let productCategory: ProductCategory;

    it('create method should add a Product Category', async () => {
        productCategory = await model.create({
            id: 0,
            category: 'category1'
        });
        expect(productCategory.category).toEqual('category1');
    });

    it('index method should return a list of product categories', async () => {
        const result = await model.index();
        expect(result).toEqual([{
            id: productCategory.id,
            category: 'category1'
        }]);
    });

    it('show method should return the correct product category', async () => {
        const result = await model.show(productCategory.id);
        expect(result).toEqual({
            id: productCategory.id,
            category: 'category1'
        });
    });

    it('update method should update a product category', async () => {
        const result = await model.update({
            id: productCategory.id,
            category: 'category1update'
        });
        expect(result).toEqual({
            id: productCategory.id,
            category: 'category1update'
        });
    });

    it('delete method should remove the product category', async () => {
        await model.delete(productCategory.id);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});