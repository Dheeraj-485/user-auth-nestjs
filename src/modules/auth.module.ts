import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from '../utils/jwt.strategy';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { LocalStrategy } from '../utils/local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule,
    UserModule,

    JwtModule.register({
      secret: 'thisissecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JWTStrategy],
})
export class AuthModule {}
