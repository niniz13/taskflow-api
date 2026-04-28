import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { HttpException } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Une erreur interne est survenue';

    // TODO: gérer les cas suivants :
    // 1. instanceof HttpException → récupérer status et message avec getStatus() / getResponse()
    // 2. instanceof QueryFailedError (TypeORM) → si code '23505' (unique constraint) → 409
    // 3. Autres → logger l'erreur
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as { message?: string | string[] }).message ||
            'Une erreur est survenue';
    } else if (exception instanceof QueryFailedError) {
      if ((exception as any).code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Conflit : une ressource avec les mêmes données existe déjà';
      }
    } else {
      this.logger.error(
        'Erreur non gérée',
        exception instanceof Error ? exception.stack : '',
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
