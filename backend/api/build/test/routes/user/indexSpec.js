"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const user_1 = __importDefault(require("../../../routes/user"));
const user_2 = require("../../../models/user");
const req = (0, supertest_1.default)(user_1.default);
// User
describe('Test suite for /user', () => {
    const modelUser = new user_2.ModelUser();
    let user;
    let token;
    beforeAll(async () => {
        // create a test user
        user = await modelUser.create({
            id: 0,
            email: 'email@something.com',
            firstName: 'First',
            lastName: 'Last',
            password: 'Pass'
        });
        // login to get auth token
        const login = await req.post('/user/login').send({ email: 'email@something.com', password: 'Pass' });
        token = login.body.token;
    });
    afterAll(async () => {
        await modelUser.delete(user.id);
    });
    it('/user/create', async () => {
        await req
            .post('/user/create')
            .set('Authorization: ', `Bearer ${token}`)
            .send({
            id: 0,
            email: 'email_test@something.com',
            firstName: 'FirstTest',
            lastName: 'LastTest',
            password: 'PassTest'
        })
            .expect(200)
            .expect((response) => {
            expect(response.body)
                .toEqual({
                id: user.id + 1,
                email: 'email_test@something.com',
                firstName: 'FirstTest',
                lastName: 'LastTest',
                password: 'PassTest'
            });
        });
    });
    it('/user/index', async () => {
        await req
            .get('/user/index')
            .set('Authorization: ', `Bearer ${token}`)
            .expect(200)
            .expect((response) => {
            const users = response.body;
            expect(users.length).toEqual(2);
        });
    });
    it('/user/show/1', async () => {
        await req
            .get('/user/show/1')
            .set('Authorization: ', `Bearer ${token}`)
            .expect(200)
            .expect((response) => {
            const user = response.body;
            expect(user.email).toBe('email@something.com');
            expect(user.firstName).toBe('First');
            expect(user.lastName).toBe('Last');
        });
    });
});
