import { User, ModelUser } from '../../models/user';

const model = new ModelUser();

describe("User Model", () => {
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

    it('should have a authenticate method', () => {
        expect(model.authenticate).toBeDefined();
    });

    it('create method should add a user', async () => {
        const result = await model.create({
            id: 0,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        });
        expect(result).toEqual({
            id: 1,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        });
    });

    it('index method should return a list of users', async () => {
        const result = await model.index();
        expect(result).toEqual([{
            id: 1,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        }]);
    });

    it('show method should return the correct user', async () => {
        const result = await model.show(1);
        expect(result).toEqual({
            id: 1,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        });
    });

    it('update method should update a product fields', async () => {
        const result = await model.update({
            id: 1,
            email: 'email_update@something.com',
            firstName: 'First_update',
            lastName: 'Last_update',
            password: 'Pass_update'
        });
        expect(result).toEqual({
            id: 1,
            email: 'email_update@something.com',
            firstName: 'First_update',
            lastName: 'Last_update',
            password: 'Pass_update'
        });
    });

    it('delete method should remove the user', async () => {
        model.delete(1);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});