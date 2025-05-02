import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalException } from './exceptions/http-exception.filter';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTMiddleware } from './middlewares/jwt.middleware';
import { loggingMiddleware } from './middlewares/logging.middleware';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'auth',
    //   entities: [User],
    //   synchronize: true,
    // }),
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalException },
    { provide: APP_INTERCEPTOR, useClass: loggingInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware, loggingMiddleware).forRoutes('auth/me');
  }
}
