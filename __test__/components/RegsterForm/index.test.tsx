/* eslint-disable camelcase */
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../../../src/components/RegisterForm';
import { useProductsStore } from '../../../src/stores';
import { convertDateToString, Product } from '../../../src/core';

// Mocking necessary modules and hooks
jest.mock('react-router-dom', () => ({
	useLocation: jest.fn(),
	useNavigate: jest.fn()
}));
jest.mock('../../stores', () => ({
	useProductsStore: jest.fn()
}));
jest.mock('../Loader', () => ({
	Loader: (): JSX.Element => <div>Loading...</div>
}));
jest.mock('../Alert', () => ({
	// eslint-disable-next-line react/prop-types
	Alert: ({ message }): JSX.Element => <div>{message}</div>
}));

describe('RegisterForm', () => {
	const mockNavigate = jest.fn();
	const mockCreateProduct = jest.fn();
	const mockUpdateProduct = jest.fn();

	const mockProduct: Product = {
		id: '1',
		name: 'Test Product',
		description: 'Test Description',
		logo: 'test-logo.png',
		date_release: new Date(),
		date_revision: new Date()
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
		(useProductsStore as unknown as jest.Mock).mockReturnValue({
			createProduct: mockCreateProduct,
			updateProduct: mockUpdateProduct,
			isLoading: false,
			error: null,
			updatedProduct: null
		});
	});

	test('renders loading state', () => {
		(useProductsStore as unknown as jest.Mock).mockReturnValue({
			isLoading: true,
			createProduct: mockCreateProduct,
			updateProduct: mockUpdateProduct,
			error: null,
			updatedProduct: null
		});
		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);
		expect(screen.getByText('Loading...')).toBeTruthy();
	});

	test('renders the form with empty fields for new product', () => {
		(useLocation as jest.Mock).mockReturnValue({ state: undefined });

		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);

		expect(screen.getByLabelText('ID').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Nombre').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Descripción').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Logo').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Fecha Liberación').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Fecha Revisión').getAttribute('value')).toBe('');
	});

	test('renders the form with pre-filled fields for editing product', () => {
		(useLocation as jest.Mock).mockReturnValue({ state: mockProduct });

		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);

		expect(screen.getByLabelText('ID').getAttribute('value')).toBe(mockProduct.id);
		expect(screen.getByLabelText('Nombre').getAttribute('value')).toBe(mockProduct.name);
		expect(screen.getByLabelText('Descripción').getAttribute('value')).toBe(mockProduct.description);
		expect(screen.getByLabelText('Logo').getAttribute('value')).toBe(mockProduct.logo);
		expect(screen.getByLabelText('Fecha Liberación').getAttribute('value')).toBe(
			convertDateToString(new Date(mockProduct.date_release))
		);
		expect(screen.getByLabelText('Fecha Revisión').getAttribute('value')).toBe(
			convertDateToString(new Date(mockProduct.date_revision))
		);
	});

	test('handles form submission for creating a new product', async () => {
		(useLocation as jest.Mock).mockReturnValue({ state: undefined });

		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByLabelText('ID'), { target: { value: '2' } });
		fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'New Product' } });
		fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'New Description' } });
		fireEvent.change(screen.getByLabelText('Logo'), { target: { value: 'new-logo.png' } });
		fireEvent.change(screen.getByLabelText('Fecha Liberación'), { target: { value: '2023-07-23' } });
		fireEvent.change(screen.getByLabelText('Fecha Revisión'), { target: { value: '2023-07-23' } });

		fireEvent.click(screen.getByText('Enviar'));

		await waitFor(() => {
			expect(mockCreateProduct).toHaveBeenCalledWith({
				id: '2',
				name: 'New Product',
				description: 'New Description',
				logo: 'new-logo.png',
				date_release: '2023-07-23',
				date_revision: '2023-07-23'
			});
		});
	});

	test('handles form submission for updating an existing product', async () => {
		(useLocation as jest.Mock).mockReturnValue({ state: mockProduct });

		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Updated Product' } });

		fireEvent.click(screen.getByText('Enviar'));

		await waitFor(() => {
			expect(mockUpdateProduct).toHaveBeenCalledWith(mockProduct.id, {
				id: mockProduct.id,
				name: 'Updated Product',
				description: mockProduct.description,
				logo: mockProduct.logo,
				date_release: convertDateToString(new Date(mockProduct.date_release)),
				date_revision: convertDateToString(new Date(mockProduct.date_revision))
			});
		});
	});

	test('displays error message when product ID already exists', async () => {
		(useProductsStore as unknown as jest.Mock).mockReturnValue({
			...useProductsStore(),
			error: { name: 'ProductIdAlreadyExists' }
		});
		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'existing-id' } });
		fireEvent.click(screen.getByText('Enviar'));

		await waitFor(() => {
			expect(screen.getByText('El ID ya existe')).toBeTruthy();
		});
	});

	test('resets the form when reset button is clicked', () => {
		(useLocation as jest.Mock).mockReturnValue({ state: mockProduct });

		render(
			<BrowserRouter>
				<RegisterForm />
			</BrowserRouter>
		);

		fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Changed Name' } });
		fireEvent.click(screen.getByText('Reiniciar'));

		expect(screen.getByLabelText('ID').getAttribute('value')).toBe(mockProduct.id);
		expect(screen.getByLabelText('Nombre').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Descripción').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Logo').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Fecha Liberación').getAttribute('value')).toBe('');
		expect(screen.getByLabelText('Fecha Revisión').getAttribute('value')).toBe('');
	});
});
