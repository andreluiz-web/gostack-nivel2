/* eslint-disable class-methods-use-this */
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import AppError from '@shared/error/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import AuthConfig from '../../../config/Auth';

interface RequestDTO {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: RequestDTO): Promise<Response> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const matchedPassword = await compare(password, user.password);

        if (!matchedPassword) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const { secret, expiresIn } = AuthConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}
export default AuthenticateUserService;
