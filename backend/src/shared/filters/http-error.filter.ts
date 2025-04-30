import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CustomError } from 'src/modules/error/custom-error';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];

    if (exception instanceof CustomError) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      messages = exceptionResponse.messages || ['An error occurred'];
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        messages = [exceptionResponse];
      } else if (Array.isArray(exceptionResponse.message)) {
        messages = exceptionResponse.message;
      } else if (Array.isArray(exceptionResponse.messages)) {
        messages = exceptionResponse.messages;
      } else if (exceptionResponse.message) {
        messages = [exceptionResponse.message];
      } else {
        messages = [exception.message];
      }
    } else if (exception instanceof Error) {
      messages = [exception.message];
    }

    if (status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.CONFLICT;
    }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Internal server error', exception);
    }
    response.status(status).json({
      status,
      messages,
    });
  }
}
