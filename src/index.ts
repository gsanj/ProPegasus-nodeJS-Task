import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from 'express';
import { Server } from 'http';
import crateHttpError from 'http-errors';
import { config } from 'dotenv';
import { getCurrentStockLevel } from './stocks.controller';
import { Stock } from './stocks.interface';

const app: Application = express();
config();

/**
* Health check api to check server status
*/
app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.send("Welcome to NodeJS task assignment");
})

/**
* Get current stock level
*/
app.get('/stocks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skuId: any = req.query.sku;
        if (skuId !== '' && skuId !== undefined && skuId !== null) {
            const stockResult: Stock = await getCurrentStockLevel(skuId);
            res.status(200).send(stockResult);
        } else {
            res.status(400).send({ status: 400, message: "Invalid query parameters!" });
        }
    } catch (err: any) {
        next(err);
    }
})

/**
* Error Handler block
*/
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new crateHttpError.NotFound())
})
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message
    });
}
app.use(errorHandler);

const PORT: Number = Number(process.env.PORT) || 3000;
const server: Server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
})

export default app;