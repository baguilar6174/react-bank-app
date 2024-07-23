export interface ApiError {
	target: Product;
	value: string;
	property: string;
	children: unknown[];
	constraints: Constraints;
}

export interface Constraints {
	minLength: string;
}

export interface ErrorResponse {
	name: string;
	message: string;
	constraints?: string[];
}

export interface RemoveProductResponse {
	message: string;
}

export interface UpdateProductResponse {
	message: string;
	data: Product;
}

export interface ProductsResponse {
	data: Product[];
}

export interface Product {
	id: string;
	name: string;
	description: string;
	logo: string;
	date_release: Date;
	date_revision: Date;
}
