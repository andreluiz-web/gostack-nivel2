import { Response, Request, NextFunction, request } from 'express';
import { verify } from 'jsonwebtoken';
import AuthConfig from '../config/Auth';

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

    // verifica se o token foi passado
    if (!authHeader) {
        throw new Error('JWT Token is missing');
    }

    // separa o type do token do próprio token
    // bearer fjhgHSGDHASGDH
    const [, token] = authHeader.split(' ');

    try {
        // verifica se o token passado tem o mesmo secret do nosso app
        const decoded = verify(token, AuthConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new Error('invalid JWT token');
    }
}

export default ensureAuthenticated;
