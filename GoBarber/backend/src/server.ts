/* eslint-disable no-console */
import express from 'express';
import routes from './routes/index';
import './database';
import uploadConfig from './config/Upload';

const app = express();
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

const serverPort = 3333;
app.listen(serverPort, () => {
    console.log(`🚀 server is running at http://localhost:${serverPort}`);
});
