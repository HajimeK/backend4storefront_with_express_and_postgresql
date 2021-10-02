import request from 'supertest';
import app from '../../../server';
import { ModelUser, User } from '../../../models/user';

// User
describe('Test suite for /user', () => {

    const modelUser = new ModelUser();
    // login to get auth token

    let user: User;
    let token: string;

    const req = request(app);

    beforeAll(async () => {
        // create a test user
        user = await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstname: 'First',
            lastname: 'Last',
            password: 'Pass'
        });
    });

    afterAll(async () => {
        await modelUser.delete(user.id);
    });

    it('/user/login', async () => {
        await req
            .post('/user/login')
            .send({email: 'email@something.com', password: 'Pass'})
            .expect(200);
    });

    it('/user/create', async () => {
        await req
            .post('/user/create')
            .auth(token, {type: 'bearer'})
            .send(
                {
                    id: 0,
                    email: 'email_test@something.com',
                    firstName: 'FirstTest',
                    lastName: 'LastTest',
                    password: 'PassTest'
                }
            )
            .expect(200)
            .expect((response) => {
                expect(response.body)
                .toEqual(
                    {
                        id: user.id + 1,
                        email: 'email_test@something.com',
                        firstName: 'FirstTest',
                        lastName: 'LastTest',
                        password: 'PassTest'
                    }
                );
            });
    });

    it('/user/index', async () => {
        await req
            .get('/user/index')
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect ( (response) => {
                const users = response.body as User[];
                expect(users.length).toEqual(2);
            });
    });

    it('/user/show/1', async () => {
        await req
            .get('/user/show/1')
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect ( (response) => {
                const user = response.body as User;
                expect(user.email).toBe('email@something.com');
                expect(user.firstname).toBe('First');
                expect(user.lastname).toBe('Last');
            });
    });
});