import { ApplicationError } from './application.error';

export class DuplicationError extends ApplicationError {
  constructor(message: string) {
    super('DuplicationError', message);
  }
}
