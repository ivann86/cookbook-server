export class AppError extends Error {
  public statusCode: number;
  public isOperational: Boolean;

  constructor(statusCode: number, message: string, isOperational: Boolean) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
