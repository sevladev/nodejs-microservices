import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY,
      });

      const storedToken = await this.redisService.get(
        `auth-token-${payload._id}`,
      );

      if (storedToken !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
