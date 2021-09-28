import { OrderStatus, ModelOrderStatus } from '../../models/orderStatus';

const model = new ModelOrderStatus();

describe("Order Status Model", () => {
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

    it('create method should add a Order Status', async () => {
        const result = await model.create({
            id: 0,
            status: 'status1'
        });
        expect(result).toEqual({
            id: 1,
            status: 'status1'
        });
    });

    it('index method should return a list of product categories', async () => {
        const result = await model.index();
        expect(result).toEqual([{
            id: 1,
            status: 'status1'
        }]);
    });

    it('show method should return the correct Order Status', async () => {
        const result = await model.show(1);
        expect(result).toEqual({
            id: 1,
            status: 'status1'
        });
    });

    it('update method should update a Order Status', async () => {
        const result = await model.update({
            id: 1,
            status: 'status1update'
        });
        expect(result).toEqual({
            id: 1,
            status: 'status1update'
        });
    });

    it('delete method should remove the Order Status', async () => {
        model.delete(1);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});