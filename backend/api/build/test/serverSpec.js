"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const req = (0, supertest_1.default)(server_1.default);
describe('Test Suite for /', () => {
    it('Server healthcheck', async () => {
        await req
            .get('/')
            .expect(200)
            .expect((response) => {
            console.log(response.body);
        });
    });
});
