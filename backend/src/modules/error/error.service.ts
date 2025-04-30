import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomError } from './custom-error';
import { errors } from 'src/shared/constants/errors.const';

interface IErrorItem {
  key: string;
  args?: Record<string, any>;
}

const typedErrors: Record<string, string> = errors;

@Injectable()
export class ErrorService {
  constructor() {}

  async sendError(errorCode: number, errors: IErrorItem[]) {
    console.log({ errorCode, errors });
    const messages = await Promise.all(
      errors.map(async (error) => {
        const message = typedErrors[error.key] as string
        return message;
      }),
    );
    console.log(messages);
    return new CustomError(errorCode, messages);
  }

  async badRequest(errors: IErrorItem[] = [{ key: 'badRequest' }]) {
    return await this.sendError(HttpStatus.BAD_REQUEST, errors);
  }

  async unauthorized(errors: IErrorItem[] = [{ key: 'unauthorized' }]) {
    return await this.sendError(HttpStatus.UNAUTHORIZED, errors);
  }

  async paymentRequired(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.PAYMENT_REQUIRED, errors);
  }

  async forbidden(errors: IErrorItem[] = [{ key: 'forbidden' }]) {
    return await this.sendError(HttpStatus.FORBIDDEN, errors);
  }

  async notFound(errors: IErrorItem[] = [{ key: 'notFound' }]) {
    return await this.sendError(HttpStatus.NOT_FOUND, errors);
  }

  async methodNotAllowed(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.METHOD_NOT_ALLOWED, errors);
  }

  async notAcceptable(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.NOT_ACCEPTABLE, errors);
  }

  async proxyAuthRequired(errors: IErrorItem[]) {
    return await this.sendError(
      HttpStatus.PROXY_AUTHENTICATION_REQUIRED,
      errors,
    );
  }

  async requestTimeout(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.REQUEST_TIMEOUT, errors);
  }

  async conflict(errors: IErrorItem[] = [{ key: 'conflict' }]) {
    return await this.sendError(HttpStatus.CONFLICT, errors);
  }

  async payloadToLarge(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.PAYLOAD_TOO_LARGE, errors);
  }

  async uriToLong(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.URI_TOO_LONG, errors);
  }

  async tooManyRequests(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.TOO_MANY_REQUESTS, errors);
  }

  async internal(errors: IErrorItem[] = [{ key: 'internal' }]) {
    return await this.sendError(HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }

  async notImplemented(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.NOT_IMPLEMENTED, errors);
  }

  async badGateway(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.BAD_GATEWAY, errors);
  }

  async serviceUnavailable(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.SERVICE_UNAVAILABLE, errors);
  }

  async gatewayTimeout(errors: IErrorItem[]) {
    return await this.sendError(HttpStatus.GATEWAY_TIMEOUT, errors);
  }
}
