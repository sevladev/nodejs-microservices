import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { safeJsonParse } from '../commons/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const response = context.switchToHttp().getResponse();
    const user = safeJsonParse(response.locals.user);

    if (!user) {
      throw new ForbiddenException();
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
