import { AxiosError } from 'axios';
import {
	type UpdateProductResponse,
	API,
	ApiError,
	AppError,
	type ProductsResponse,
	RemoveProductResponse
} from '../core';
import { ProductFormData } from '../components/RegisterForm/schema';

export class ProductsService {
	static getProducts = async (): Promise<ProductsResponse> => {
		try {
			const { data } = await API.get<ProductsResponse>('/products');
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				// eslint-disable-next-line no-unsafe-optional-chaining
				const { name, message } = error.response?.data;
				throw new AppError({ name, message });
			}
			throw AppError.internalServer('Server error in get products');
		}
	};

	static verifyProductId = async (id: string): Promise<boolean> => {
		try {
			const { data } = await API.get<boolean>(`/products/verification/${id}`);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				// eslint-disable-next-line no-unsafe-optional-chaining
				const { name, message } = error.response?.data;
				throw new AppError({ name, message });
			}
			throw AppError.internalServer('Server error in verify product id');
		}
	};

	static createProduct = async (body: ProductFormData): Promise<UpdateProductResponse> => {
		try {
			const isValidId = await this.verifyProductId(body.id);
			if (isValidId) throw new AppError({ name: 'ProductIdAlreadyExists', message: 'El ID ya existe' });
			const { data } = await API.post<UpdateProductResponse>('/products', body);
			return data;
		} catch (error) {
			if (error instanceof AppError) {
				const { name, message } = error;
				throw new AppError({ name, message });
			} else if (error instanceof AxiosError) {
				// eslint-disable-next-line no-unsafe-optional-chaining
				const { name, message, errors } = error.response?.data;
				const constraints = errors.map((err: ApiError) => Object.values(err.constraints)).flat();
				throw new AppError({ name, message, constraints });
			}
			throw AppError.internalServer('Server error in create product');
		}
	};

	static deleteProduct = async (id: string): Promise<RemoveProductResponse> => {
		try {
			const { data } = await API.delete<RemoveProductResponse>(`/products/${id}`);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				// eslint-disable-next-line no-unsafe-optional-chaining
				const { name, message } = error.response?.data;
				throw new AppError({ name, message });
			}
			throw AppError.internalServer('Server error in delete product');
		}
	};

	static updateProduct = async (id: string, body: ProductFormData): Promise<UpdateProductResponse> => {
		try {
			const { data } = await API.put<UpdateProductResponse>(`/products/${id}`, body);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				// eslint-disable-next-line no-unsafe-optional-chaining
				const { name, message, errors } = error.response?.data;
				const constraints = errors.map((err: ApiError) => Object.values(err.constraints)).flat();
				throw new AppError({ name, message, constraints });
			}
			throw AppError.internalServer('Server error in update product');
		}
	};
}
