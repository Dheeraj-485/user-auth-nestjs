import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }
}
