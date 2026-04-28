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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Supprimer passwordHash des entities User
        const cleanData = this.removePasswordHash(data);
        return cleanData;
      }),
    );
  }

  private removePasswordHash(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.removePasswordHash(item));
    }

    if (typeof data === 'object') {
      const cleaned = { ...data };
      delete cleaned.passwordHash;
      return cleaned;
    }

    return data;
  }
}
