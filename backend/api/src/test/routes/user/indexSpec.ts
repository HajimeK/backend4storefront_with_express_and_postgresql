import request from 'supertest';
import user from '../../../routes/user';
import { ModelUser, User } from '../../../models/user';

const req = request(user);

// User
describe('Test suite for /user', async () => {

    // create a test user
    const modelUser = new ModelUser();
    const user = await modelUser.create({
        id: 0,
        email: 'email@something.com',
        firstName: 'First',
        lastName: 'Last',
        password: 'Pass'
    });
    // login to get auth token
    const login = await req.post('/user/login').send({email: 'email@something.com', password: 'Pass'});

    it('/user/create', async () => {
        await req
            .post('/user/create')
            .set('Authorization: ', `Bearer ${login.body.token}`)
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
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .expect(200)
            .expect ( (response) => {
                expect(response.body.length).toEqual(2);
            });
    });

    it('/user/show/1', async () => {
        await req
            .get('/user/show/1')
            .set('Authorization: ', `Bearer ${login.body.token}`)
            .expect(200)
            .expect ( (response) => {
                const user = response.body as User;
                expect(user.email).toBe('email@something.com');
                expect(user.firstName).toBe('First');
                expect(user.lastName).toBe('Last');
            });
    });

    modelUser.delete(user.id);
    modelUser.delete(user.id+1);
});