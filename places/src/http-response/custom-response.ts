export class CustomResponse {
  private statusCode: number;
  private _r: boolean;
  private data: { error?: string; result?: any };

  status(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }

  r(r: boolean): this {
    this._r = r;
    return this;
  }

  error(error: string): this {
    this.data = { error };
    return this;
  }

  result(result: any): this {
    this.data = { result };
    return this;
  }

  build() {
    return {
      status_code: this.statusCode,
      r: this._r,
      data: this.data,
    };
  }
}
