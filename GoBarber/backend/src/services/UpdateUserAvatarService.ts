/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/Upload';
import AppError from '../Error/AppError';

interface RequestDTO {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({
        user_id,
        avatarFilename,
    }: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticates users can change avatar.',
                401,
            );
        }

        if (user.avatar) {
            // deletar avatar anterior
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
