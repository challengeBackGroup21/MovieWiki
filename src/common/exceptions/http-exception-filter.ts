import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string // 우리가 발생시키는 에러
      | { error: string; statusCode: number; message: string | string[] }; // nest 기본 에러 형식

    typeof error === 'string'
      ? response.status(status).json({
          statusCode: status,
          path: request.url,
          error,
        })
      : response.status(status).json({
          statusCode: status,
          path: request.url,
          ...error,
        });
  }
}
