import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Let AuthGuard('jwt') validate token first
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new ForbiddenException('Invalid authentication');
    }

    const request = context.switchToHttp().getRequest();
    const userIdFromParams = request.params.id;

    console.log(request.params.id);
    console.log(user.id);
    if (userIdFromParams && user.id !== userIdFromParams) {
      throw new ForbiddenException('You are not allowed to modify this user.');
    }

    return user;
  }
}
