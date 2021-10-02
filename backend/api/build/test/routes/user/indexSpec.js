"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
const user_1 = require("../../../models/user");
// User
describe('Test suite for /user', () => {
    const modelUser = new user_1.ModelUser();
    // login to get auth token
    let user;
    let token;
    const req = (0, supertest_1.default)(server_1.default);
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
            .send({ email: 'email@something.com', password: 'Pass' })
            .expect(200);
    });
    it('/user/create', async () => {
        await req
            .post('/user/create')
            .auth(token, { type: 'bearer' })
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
            .auth(token, { type: 'bearer' })
            .expect(200)
            .expect((response) => {
            const users = response.body;
            expect(users.length).toEqual(2);
        });
    });
    it('/user/show/1', async () => {
        await req
            .get('/user/show/1')
            .auth(token, { type: 'bearer' })
            .expect(200)
            .expect((response) => {
            const user = response.body;
            expect(user.email).toBe('email@something.com');
            expect(user.firstname).toBe('First');
            expect(user.lastname).toBe('Last');
        });
    });
});
