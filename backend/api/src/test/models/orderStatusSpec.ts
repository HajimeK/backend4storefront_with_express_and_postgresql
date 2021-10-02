import { ModelOrderStatus, OrderStatus } from '../../models/orderStatus';

const model = new ModelOrderStatus();

describe("Order Status Model", () => {
    let orderStatus: OrderStatus;

    it('create method should add a Order Status', async () => {
        orderStatus = await model.create({
            id: 0,
            order_status: 'status1'
        });
        expect(orderStatus.order_status).toEqual('status1');
    });

    it('index method should return a list of product categories', async () => {
        const result = await model.index();
        expect(result.length).toEqual(1);
        expect(result[0].order_status).toEqual('status1');
    });

    it('show method should return the correct Order Status', async () => {
        const result = await model.show(orderStatus.id);
        expect(result).toEqual({
            id: orderStatus.id,
            order_status: 'status1'
        });
    });

    it('update method should update a Order Status', async () => {
        const result = await model.update({
            id: orderStatus.id,
            order_status: 'status_updated'
        });
        expect(result).toEqual({
            id: orderStatus.id,
            order_status: 'status_updated'
        });
    });

    it('delete method should remove the Order Status', async () => {
        await model.delete(orderStatus.id);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});