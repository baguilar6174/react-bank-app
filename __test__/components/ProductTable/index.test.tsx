/* eslint-disable camelcase */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { useProductsStore } from '../../../src/stores/products.store';
import { ProductTable } from '../../../src/components/ProductTable';

// Mocking the necessary components and hooks
jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn()
}));
jest.mock('../../../src/stores', () => ({
	useProductsStore: jest.fn()
}));
jest.mock('../../../src/components/Loader', () => ({
	Loader: (): JSX.Element => <div>Loading...</div>
}));
jest.mock('../../../src/components/Alert', () => ({
	// eslint-disable-next-line react/prop-types
	Alert: ({ message }): JSX.Element => <div>{message}</div>
}));

describe('ProductTable', () => {
	const mockGetProducts = jest.fn();
	const mockDeleteProduct = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useProductsStore as unknown as jest.Mock).mockReturnValue({
			isLoading: false,
			products: [
				{
					id: '1',
					name: 'Product 1',
					description: 'Description 1',
					date_release: new Date(),
					date_revision: new Date(),
					logo: 'logo1.png'
				},
				{
					id: '2',
					name: 'Product 2',
					description: 'Description 2',
					date_release: new Date(),
					date_revision: new Date(),
					logo: 'logo2.png'
				}
			],
			message: '',
			getProducts: mockGetProducts,
			deleteProduct: mockDeleteProduct
		});
	});

	test('renders loading state', () => {
		(useProductsStore as unknown as jest.Mock).mockReturnValue({
			isLoading: true,
			products: [],
			message: ''
		});
		render(
			<BrowserRouter>
				<ProductTable />
			</BrowserRouter>
		);
		expect(screen.getByText('Loading...')).toBeDefined();
	});

	test('renders products table', async () => {
		render(
			<BrowserRouter>
				<ProductTable />
			</BrowserRouter>
		);
		expect(screen.getByPlaceholderText('Search...')).toBeDefined();
		expect(screen.getByText('Product 1')).toBeDefined();
		expect(screen.getByText('Product 2')).toBeDefined();
	});

	test('filters products based on search term', () => {
		render(
			<BrowserRouter>
				<ProductTable />
			</BrowserRouter>
		);
		const searchInput = screen.getByPlaceholderText('Search...');
		fireEvent.change(searchInput, { target: { value: 'Product 1' } });
		expect(screen.getByText('Product 1')).toBeDefined();
		expect(screen.queryByText('Product 2')).toBeNull();
	});

	test('opens and closes modal', async () => {
		render(
			<BrowserRouter>
				<ProductTable />
			</BrowserRouter>
		);
		const deleteButton = screen.getAllByText('Eliminar')[0];
		fireEvent.click(deleteButton);
		await waitFor(() => expect(screen.getByText('Confirmar')).toBeDefined());

		const cancelButton = screen.getByText('Cancelar');
		fireEvent.click(cancelButton);
		await waitFor(() => expect(screen.queryByText('Confirmar')).toBeNull());
	});

	test('calls delete product function', async () => {
		render(
			<BrowserRouter>
				<ProductTable />
			</BrowserRouter>
		);
		const deleteButton = screen.getAllByText('Eliminar')[0];
		fireEvent.click(deleteButton);
		await waitFor(() => expect(screen.getByText('Confirmar')).toBeDefined());

		const confirmButton = screen.getByText('Confirmar');
		fireEvent.click(confirmButton);
		await waitFor(() => expect(mockDeleteProduct).toHaveBeenCalledWith('1'));
	});

	test('displays message alert', () => {
		(useProductsStore as unknown as jest.Mock).mockReturnValue({
			isLoading: false,
			products: [],
			message: 'Test message'
		});
		render(
			<BrowserRouter>
				<ProductTable />
			</BrowserRouter>
		);
		expect(screen.getByText('Test message')).toBeDefined();
	});
});
