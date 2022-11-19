import { ApplicationError } from './application.error';

export class ValidationError extends ApplicationError {
  public details: { path: string; message: string }[] = [];

  constructor(message: string) {
    super('ValidationError', message);
  }
}
