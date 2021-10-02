import { ModelOrder, Order } from '../../models/order';
import { ModelOrderItem, OrderItem } from '../../models/orderItem';
import { ModelOrderStatus, OrderStatus } from '../../models/orderStatus';
import { ModelProduct, Product } from '../../models/product';
import { ModelProductCategory, ProductCategory } from '../../models/productCategory';
import { ModelUser, User } from '../../models/user';


describe("Order Item Model", () => {

    const model = new ModelOrderItem();
    const modelProductCategory = new ModelProductCategory();
    const modelOrderStatus = new ModelOrderStatus();
    const modelProduct = new ModelProduct();
    const modelUser = new ModelUser();
    const modelOrder = new ModelOrder();

    let category : ProductCategory;
    let status : OrderStatus;
    let product1: Product;
    let product2: Product;
    let oi: OrderItem[];
    let oi_update:OrderItem[];
    let user: User;
    let order: Order;
    let orderItem0: OrderItem;
    let orderItem1: OrderItem;

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

        // create an order
        order = await modelOrder.create({
            id: 0,
            appuser: user.id,
            order_status: status.id
        });

        oi = [
            {id: 0, apporder: order.id, product: product1.id, quantity: 10},
            {id: 0, apporder: order.id, product: product2.id, quantity: 10}
        ];
        oi_update = [
            {id: 0, apporder: order.id, product: product1.id, quantity: 20},
            {id: 0, apporder: order.id, product: product2.id, quantity: 20}
        ];
    });

    afterAll( async () => {
        // delete a order
        await modelOrder.delete(order.id);
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

    it('create method should add an order item', async () => {
        orderItem0 = await model.create(oi[0]);
        expect(orderItem0.apporder).toBe(order.id);
        expect(orderItem0.product).toBe(oi[0].product);
        expect(orderItem0.quantity).toBe(oi[0].quantity);

        orderItem1 = await model.create(oi[1]);
        expect(orderItem1.apporder).toBe(order.id);
        expect(orderItem1.product).toBe(oi[1].product);
        expect(orderItem1.quantity).toBe(oi[1].quantity);
    });

    it('index method should return a list of order items for an order', async () => {
        const items = await model.index(order.id);
        expect(items.length).toEqual(2);
    });

    it('show method should return the correct order', async () => {
        const result = await model.show(orderItem0.id);
        expect(result.apporder).toEqual(orderItem0.apporder);
    });

    it('update method should update an order item quantity', async () => {
        const result = await model.update({
            id: orderItem0.id,
            apporder: orderItem0.apporder,
            product: orderItem0.product,
            quantity: oi_update[0].quantity
        });
        expect(result).toEqual({
            id: orderItem0.id,
            apporder: orderItem0.apporder,
            product: orderItem0.product,
            quantity: oi_update[0].quantity
        });
    });

    it('delete method should remove the order', async () => {
        await model.delete(orderItem0.id);
        await model.delete(orderItem1.id);
        const result = await model.index(user.id)
        expect(result).toEqual([]);
    });

});