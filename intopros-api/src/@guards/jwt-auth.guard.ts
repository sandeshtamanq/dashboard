import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { ExtractJwt } from 'passport-jwt';
import { decode, verify } from 'jsonwebtoken';

import { IS_PUBLIC_KEY } from '../@decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) return false;

    await super.canActivate(context);

    try {
      verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedException('Invalid Username/Password!');
    }

    const details = decode(token);
    if (!details) return false;

    return true;
  }
}
