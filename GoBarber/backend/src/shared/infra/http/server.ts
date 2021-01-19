/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import AppError from '@shared/error/AppError';
import routes from './routes/index';
import '../typeorm';
import uploadConfig from '../../../config/Upload';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }

        return response.status(500).json({
            status: 'error',
            message: 'internal server error',
        });
    },
);

const serverPort = 3333;
app.listen(serverPort, () => {
    console.log(`🚀 server is running at http://localhost:${serverPort}`);
});
