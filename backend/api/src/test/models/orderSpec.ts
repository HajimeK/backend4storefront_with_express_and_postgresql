import { ModelOrder, Order } from '../../models/order';
import { ModelOrderStatus, OrderStatus } from '../../models/orderStatus';
import { ModelProduct, Product } from '../../models/product';
import { ModelProductCategory, ProductCategory } from '../../models/productCategory';
import { ModelUser, User } from '../../models/user';


describe("Order Model", () => {

    const model = new ModelOrder();
    const modelProductCategory = new ModelProductCategory();
    const modelOrderStatus = new ModelOrderStatus();
    const modelProduct = new ModelProduct();
    const modelUser = new ModelUser();

    let category : ProductCategory;
    let status : OrderStatus;
    let status_update : OrderStatus;
    let product1: Product;
    let product2: Product;
    let user: User;
    let order: Order;

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
            userpassword: 'Pass'
        });
    });

    afterAll( async () => {
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
        const result = await model.index(user.id)
        expect(result).toEqual([]);
    });

});