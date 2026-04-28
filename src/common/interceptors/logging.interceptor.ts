import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    // TODO: retourner next.handle().pipe(
    //   tap({
    //     next: () => { logger.log(`${method} ${url} ${statusCode} [${ms}ms]`) },
    //     error: (err) => { logger.warn(...) },
    //   })
    // )
    // Indice : le statusCode est disponible sur context.switchToHttp().getResponse()
    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode;
          const ms = Date.now() - start;
          this.logger.log(`${method} ${url} ${statusCode} [${ms}ms]`);
        },
        error: (err) => {
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode || 500;
          const ms = Date.now() - start;
          this.logger.warn(
            `${method} ${url} ${statusCode} [${ms}ms] - ${err.message}`,
          );
        },
      }),
    );
  }
}
