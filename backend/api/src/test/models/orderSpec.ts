import { Order, ModelOrder } from '../../models/order';
import { ModelOrderStatus } from '../../models/orderStatus';
import { ModelProduct } from '../../models/product';
import { ModelProductCategory } from '../../models/productCategory';
import { ModelUser } from '../../models/user';

const model = new ModelOrder();
const modelProductCategory = new ModelProductCategory();
const modelOrderStatus = new ModelOrderStatus();
const modelProduct = new ModelProduct();
const modelUser = new ModelUser();

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

    // create a product category
    await modelProductCategory.create({
        id: 0,
        category: 'category1'
    });
    const category = await modelProductCategory.show(1);
    // create a order status
    await modelOrderStatus.create({
        id: 0,
        status: 'status1'
    });
    const status = await modelProductCategory.show(1);
    await modelOrderStatus.create({
        id: 0,
        status: 'status2'
    });
    const status_update = await modelProductCategory.show(2);
    // create a product 1
    await modelProduct.create({
        id: 0,
        name: 'product1',
        price: 123456,
        category: category.id
    });
    const product1 = await modelProduct.show(1);
    // create a product 2
    await modelProduct.create({
        id: 0,
        name: 'product2',
        price: 123456,
        category: category.id
    });
    const product2 = await modelProduct.show(2);

    const oi = [
        {id: 0, product_id: product1.id, quantity: 10},
        {id: 0, product_id: product2.id, quantity: 10}
    ];
    const oi_update = [
        {id: 0, product_id: product1.id, quantity: 20},
        {id: 0, product_id: product2.id, quantity: 20}
    ];

    // create a user
    await modelUser.create({
        id: 0,
        email: 'email@something.com',
        firstName: 'First',
        lastName: 'Last',
        password: 'Pass'
    });
    const user = await modelUser.show(1);

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
        model.delete(1);
        const result = await model.index(user.id)
        expect(result).toEqual([]);
    });

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