import express, { Request, Response } from 'express';
import morgan from 'morgan'; // log output
import helmet from 'helmet'; // secure header
import cors from 'cors'; // Cross-Origine
import rateLimit from 'express-rate-limit';
import product from './routes/product/index';
import user from './routes/user/index';
import order from './routes/order/index';

// Defind application
const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(morgan("common"));
app.use(helmet());

// whitelist
const allowedOrigins = ['http://localhost:3000'];
const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(corsOptions));

// limitter
const limitter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
});
app.use(limitter);

app.use(express.json())

// router
app.use('/product', product);
app.use('/user', user);
app.use('/order', order);

app.get('/', function (request: Request, response: Response) {
    response.status(200).send('Receving requests from your IP address:' + request.ip);
})

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app;