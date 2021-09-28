import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { User, ModelUser } from '../../models/user';
import { verifyAuthToken } from '../util/auth';

dotenv.config();

const user =  express.Router();
user.use(
    express.urlencoded({
        extended: true
    })
)
user.use(express.json());

const model = new ModelUser();

user.get('/index', verifyAuthToken, async (request, response) => {
    try {
        const users = await model.index();

        return response.status(200).send(users);
    } catch(error) {
        return response.status(400).send(`Could not get users. Error: ${error}`);
    }
});

user.get('/show/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id as string);
    try {
        const p = await model.show(id);

        return response.status(200).send(p);
    } catch(error) {
        return response.status(400).send(`Could not get a user. Error: ${error}`);
    }
});

user.post('/create', verifyAuthToken, async (request, response) => {
    const u = request.body.user as User;
    console.log(u);
    try {
        const u_created = await model.create(u);

        return response.status(200).send(u_created);
    } catch(error) {
        return response.status(400).send(`Could not create a user ${u}. Error: ${error}`);
    }
});

user.delete('/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const user = await model.delete(id);

        return response.status(200).send(user);
    } catch(error) {
        return response.status(400).send(`Could not create a product ${user}. Error: ${error}`);
    }
});

user.post('/login', async (request, response) => {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send('Missing email/password in request body');
    }

    const user = await model.authenticate(email, password);
    if (user && user.id) {
        const {id, email} = user;
        const { TOKEN_SECRET } = process.env;
        response.status(200).send({
            id: user.id,
            token: Jwt.sign(email, TOKEN_SECRET as string)
        });
    } else {
        response.status(401).send('Invalid user credentials');
    }
});

export default user;