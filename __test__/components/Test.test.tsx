import React from 'react';
import { render, screen } from '@testing-library/react';

import { ProductTable } from '../../src/components/ProductTable';

describe('Tests on <App/> component', (): void => {
	test('renders Vite + React h1', (): void => {
		render(<ProductTable />);
		const h1Element = screen.getByText(/Vite/i);
		expect(h1Element).toBeTruthy();
	});
});
