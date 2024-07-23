import { ErrorResponse } from '../types';

export class AppError extends Error {
	public readonly name: string;
	public readonly constraints?: string[];

	constructor(args: ErrorResponse) {
		const { message, name, constraints } = args;
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.constraints = constraints;
		this.name = name ?? 'Aplication Error';
	}

	static internalServer(message: string): AppError {
		return new AppError({ name: 'InternalServerError', message });
	}
}
