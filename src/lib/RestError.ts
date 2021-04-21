export class RestError extends Error {
    public readonly statusCode: number;
    constructor(status_code: number, message: string) {
        super(message);
        this.name = `RestError`;
        this.statusCode = status_code;
    }
}
