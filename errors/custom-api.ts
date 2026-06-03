export class CustomAPIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomAPIError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
