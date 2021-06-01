import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidatorError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('invalid email or password');

    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
