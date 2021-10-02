import { ModelUser, User } from '../../models/user';

const model = new ModelUser();

describe("User Model", () => {

    let user: User;
    it('create method should add a user', async () => {
        user = await model.create({
            id: 0,
            email: 'email@something.com',
            firstname: 'First',
            lastname: 'Last',
            userpassword: 'Pass'
        });
        expect(user.email).toEqual('email@something.com');
        expect(user.firstname).toEqual('First');
        expect(user.lastname).toEqual('Last');
    });

    it('index method should return a list of users', async () => {
        const result = await model.index();
        expect(result.length).toEqual(1);
    });

    it('show method should return the correct user', async () => {
        const result = await model.show(user.id);
        expect(result.email).toEqual('email@something.com');
        expect(result.firstname).toEqual('First');
        expect(result.lastname).toEqual('Last');
    });

    it('authenticate with correst user/pass to approve login', async () => {
        const result = await model.authenticate('email@something.com', 'Pass');
        expect(result).not.toBeNull();
    });

    it('authenticate with wrong pass to approve login', async () => {
        const result = await model.authenticate('email@something.com', 'Wrong');
        expect(result).toBeNull();
    });

    it('authenticate with wrong user to approve login', async () => {
        const result = await model.authenticate('wrong@something.com', 'Pass');
        expect(result).toBeNull();
    });

    it('update method should update a product fields', async () => {
        const result = await model.update({
            id: user.id,
            email: 'email_update@something.com',
            firstname: 'First_update',
            lastname: 'Last_update',
            userpassword: 'Pass_update'
        });
        expect(result.email).toEqual('email_update@something.com');
        expect(result.firstname).toEqual('First_update');
        expect(result.lastname).toEqual('Last_update');
    });

    it('delete method should remove the user', async () => {
        await model.delete(user.id);
        const result = await model.index()

        expect(result).toEqual([]);
    });
});