/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../Error/AppError';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: RequestDTO): Promise<User> {
        const userRepository = getRepository(User);

        const hashedPassword = await hash(password, 8);

        const checkExistsUser = await userRepository.findOne({
            where: { email },
        });

        if (checkExistsUser) {
            throw new AppError('Email address already used');
        }

        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);

        return user;
    }
}

export default CreateUserService;
