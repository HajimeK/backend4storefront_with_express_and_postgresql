import request from 'supertest';
import app from '../../../server';
import { ModelUser, User } from '../../../models/user';
import { loginToken } from '../../../routes/user';

// User
describe('Test suite for /user', () => {

    const modelUser = new ModelUser();
    // login to get auth token

    let user: User;
    let createdUser: User;
    let userid = 1;
    let token: string;
    let credential: loginToken

    const req = request(app);

    beforeAll(async () => {
        // create a test user
        user = await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstname: 'First',
            lastname: 'Last',
            userpassword: 'Pass'
        });
    });

    afterAll(async () => {
        await modelUser.delete(user.id);
    });

    it('/user/login', async () => {
        await req
            .post('/user/login')
            .send({email: 'email@something.com', password: 'Pass'})
            .expect(200)
            .expect((res) => {
                credential = res.body as loginToken;
                token = credential.token;
            });
    });

    it('/user/create', async () => {
        await req
            .post('/user/create')
            .auth(token, {type: 'bearer'})
            .send(
                {
                    id: 0,
                    email: 'email_test@something.com',
                    firstname: 'FirstTest',
                    lastname: 'LastTest',
                    userpassword: 'PassTest'
                }
            )
            .expect(200)
            .expect ( (response) => {
                createdUser = response.body as User;
                expect(createdUser.email).toBe('email_test@something.com');
                expect(createdUser.firstname).toBe('FirstTest');
                expect(createdUser.lastname).toBe('LastTest');
                userid = createdUser.id;
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

    it(`/user/show/${userid}`, async () => {
        await req
            .get(`/user/show/${userid}`)
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect ( (response) => {
                const user = response.body as User;
                expect(user.email).toBe(createdUser.email);
                expect(user.firstname).toBe(createdUser.firstname);
                expect(user.lastname).toBe(createdUser.lastname);
            });
    });
});