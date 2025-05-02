import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const secret = this.configService.get('JWT_SECRET');

    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      throw new NotFoundException('Token is missing');
    }
    console.log(secret);

    try {
      const decoded = jwt.verify(token, secret);
      if (!decoded) {
        throw new UnauthorizedException('Token not matching');
      }
      req['user'] = decoded;
      console.log(decoded, token);

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
