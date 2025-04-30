import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class RoleGuard implements CanActivate {
  private rolePassed: string;
  constructor(role: string) {
    this.rolePassed = role;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request: any = ctx.getRequest();

    if (this.rolePassed !== request.user.role) {
      throw new ForbiddenException(
        `You need the '${this.rolePassed}' role to access this resource`,
      );
    }
    return this.rolePassed === request.user.role;
  }
}
