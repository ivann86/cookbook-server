export class ApplicationError extends Error {
  public isOperational = true;

  constructor(public name = 'UnknownError', message: string) {
    super(message);
  }
}
