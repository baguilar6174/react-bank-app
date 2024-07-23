import { type StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type ErrorResponse, type Product } from '../core';
import { ProductsService } from '../services/products.service';
import { ProductFormData } from '../components/RegisterForm/schema';

interface State {
	products: Product[];
	isValidId?: boolean;
	isLoading: boolean;
	error?: ErrorResponse;
	message?: string;
}

interface Actions {
	getProducts: () => Promise<void>;
	createProduct: (data: ProductFormData) => Promise<void>;
	verifyProductId: (id: string) => Promise<void>;
	deleteProduct: (id: string) => Promise<void>;
}

type Store = State & Actions;

const productsAPI: StateCreator<Store> = (set, get) => ({
	products: [],
	isLoading: false,
	getProducts: async (): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.getProducts();
			set({ isLoading: false, products: result.data });
		} catch (error) {
			set({ isLoading: false, products: [], error: error as ErrorResponse });
		}
	},
	createProduct: async (data: ProductFormData): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.createProduct(data);
			set({ isLoading: false, products: [...state.products, result.data], message: result.message });
		} catch (error) {
			set({ isLoading: false, error: error as ErrorResponse });
		}
	},
	verifyProductId: async (id: string): Promise<void> => {
		const state = get();
		set({ ...state, isLoading: true, error: undefined });
		try {
			const result = await ProductsService.verifyProductId(id);
			set({ isLoading: false, isValidId: result });
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
	}
});

export const useProductsStore = create<Store>()(devtools(productsAPI));
