import { ValidationError } from 'express-validator';

export class RequestValidatorError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }
}
