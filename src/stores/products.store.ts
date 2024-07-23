import { type StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type ErrorResponse, type Product } from '../core';
import { ProductsService } from '../services/products.service';
import { ProductFormData } from '../components/RegisterForm/schema';

interface State {
	products: Product[];
	updatedProduct?: Product;
	isLoading: boolean;
	error?: ErrorResponse;
	message?: string;
	isValidId?: boolean;
}

interface Actions {
	getProducts: () => Promise<void>;
	createProduct: (data: ProductFormData) => Promise<void>;
	deleteProduct: (id: string) => Promise<void>;
	updateProduct: (id: string, data: ProductFormData) => Promise<void>;
}

type Store = State & Actions;

const productsAPI: StateCreator<Store> = (set, get) => ({
	products: [],
	updatedProduct: undefined,
	isLoading: false,
	getProducts: async (): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.getProducts();
			set({ isLoading: false, products: result.data, updatedProduct: undefined });
		} catch (error) {
			set({ isLoading: false, products: [], error: error as ErrorResponse });
		}
	},
	createProduct: async (data: ProductFormData): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.createProduct(data);
			set({
				isLoading: false,
				products: [...state.products, result.data],
				message: result.message,
				updatedProduct: result.data
			});
		} catch (error) {
			set({ isLoading: false, error: error as ErrorResponse });
		}
	},
	deleteProduct: async (id: string): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.deleteProduct(id);
			set({
				isLoading: false,
				message: result.message,
				products: state.products.filter((product) => product.id !== id)
			});
		} catch (error) {
			set({ isLoading: false, error: error as ErrorResponse });
		}
	},
	updateProduct: async (id: string, data: ProductFormData): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.updateProduct(id, data);
			set({
				isLoading: false,
				message: result.message,
				products: state.products.map((product) => {
					if (product.id === id) return result.data;
					return product;
				}),
				updatedProduct: result.data
			});
		} catch (error) {
			set({ isLoading: false, error: error as ErrorResponse });
		}
	}
});

export const useProductsStore = create<Store>()(devtools(productsAPI));
