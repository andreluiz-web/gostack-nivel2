/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes/index';
import './database';
import cors from 'cors';
import uploadConfig from './config/Upload';
import AppError from './Error/AppError';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// tratativa global de erros
app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        // verifica se o erro que ocorreu é originado da nossa própria classe de erros.
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }

        // se nao for retornamos um erro generico, como o status code = 500.
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
