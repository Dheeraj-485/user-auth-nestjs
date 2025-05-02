import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class loggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const now = Date.now();

    console.log(`[Interceptor] ${request.method} ${request.url} - Started`);

    return next.handle().pipe(
      // map((data) => {
      //   if (data?.user?.username) {
      //     data.user.username=data.user.username.toUpperCase()
      //   }
      //   return data;
      // }),
      tap(() =>
        console.log(
          `[Interceptor] ${request.method} ${request.url} - Completed in ${
            Date.now() - now
          }ms`,
        ),
      ),
    );
  }
}
