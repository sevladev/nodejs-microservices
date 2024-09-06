import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { CustomError } from '../errors/custom-error';
import { ERRORS } from '../commons/constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    if (!authHeader) {
      return res
        .status(ERRORS.UNAUTHORIZED.code)
        .json(ERRORS.UNAUTHORIZED.json);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(ERRORS.UNAUTHORIZED.code)
        .json(ERRORS.UNAUTHORIZED.json);
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });

      const storedToken = await this.redisService.get(
        `auth-token-${payload._id}`,
      );

      if (!storedToken) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      const storedTokenPayload = JSON.parse(storedToken);

      if (storedTokenPayload.token !== token) {
        return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
      }

      return next();
    } catch (error) {
      return res.status(ERRORS.FORBIDDEN.code).json(ERRORS.FORBIDDEN.json);
    }
  }
}
