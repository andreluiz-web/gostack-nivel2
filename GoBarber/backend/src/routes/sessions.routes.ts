/* eslint-disable camelcase */
import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    const authUser = new AuthenticateUserService();

    const { user, token } = await authUser.execute({
        email,
        password,
    });

    delete user.password;

    return res.json({ user, token });
});

export default sessionsRouter;
