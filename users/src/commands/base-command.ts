export class BaseCommand {
  error: string;

  constructor() {
    this.error = "";
  }

  isValid(): boolean {
    return !this.error;
  }

  addError(message: string): boolean {
    this.error = message;
    return false;
  }

  addErrors(errors: string[]): boolean {
    this.error = errors.join(",");
    return false;
  }

  clear(): string {
    this.error = "";
    return this.error;
  }

  handleException(ex: any): boolean {
    console.warn(ex.stack);
    this.addError(ex.message);

    return false;
  }
}
