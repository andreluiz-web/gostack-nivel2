import { Response, Request, NextFunction, request } from 'express';
import { verify } from 'jsonwebtoken';
import AuthConfig from '@config/Auth';
import AppError from '@shared/error/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT Token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, AuthConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('invalid JWT token', 401);
    }
}

export default ensureAuthenticated;
