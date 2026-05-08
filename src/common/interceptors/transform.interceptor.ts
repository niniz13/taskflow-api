import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        // Supprimer passwordHash des entities User
        return this.removePasswordHash(data);
      }),
    );
  }

  private removePasswordHash(data: unknown): unknown {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item: unknown) => this.removePasswordHash(item));
    }

    if (typeof data === 'object') {
      const cleaned = { ...(data as Record<string, unknown>) };
      delete cleaned['passwordHash'];
      return cleaned;
    }

    return data;
  }
}
