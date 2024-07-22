import React, { SVGProps } from 'react';

import Rules from './styles.module.scss';
import { Modal } from '../Modal';

interface Product {
	id: number;
	logo: string;
	name: string;
	description: string;
	releaseDate: string;
	restructureDate: string;
}

export const ProductTable = (): JSX.Element => {
	const [searchTerm, setSearchTerm] = React.useState<string>('');
	const [resultsPerPage, setResultsPerPage] = React.useState<number>(5);
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

	const handleOpenModal = (): void => setIsModalOpen(true);
	const handleCloseModal = (): void => setIsModalOpen(false);
	const handleConfirm = (): void => {
		// Lógica para confirmar
		handleCloseModal();
	};

	// Mock data - replace with actual data fetching logic
	const products: Product[] = [
		{
			id: 1,
			logo: 'AP',
			name: 'Nombre del producto',
			description: 'Descripción',
			releaseDate: '01/01/2000',
			restructureDate: '01/01/2001'
		},
		{
			id: 2,
			logo: 'LO',
			name: 'Nombre del producto',
			description: 'Descripción',
			releaseDate: '01/01/2000',
			restructureDate: '01/01/2001'
		},
		{
			id: 3,
			logo: 'JS',
			name: 'Nombre del producto',
			description: 'Descripción',
			releaseDate: '01/01/2000',
			restructureDate: '01/01/2001'
		},
		{
			id: 4,
			logo: 'AP',
			name: 'Nombre del producto',
			description: 'Descripción',
			releaseDate: '01/01/2000',
			restructureDate: '01/01/2001'
		},
		{
			id: 5,
			logo: 'JS',
			name: 'Nombre del producto',
			description: 'Descripción',
			releaseDate: '01/01/2000',
			restructureDate: '01/01/2001'
		}
	];

	const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<React.Fragment>
			<div className={Rules.containerHeader}>
				<div className={Rules.searchContainer}>
					<input
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className={Rules.searchInput}
					/>
					<button className={Rules.submit}>Agregar</button>
				</div>
			</div>
			<div className={Rules.container}>
				<div className={Rules.tableWrapper}>
					<table className={Rules.table}>
						<thead>
							<tr>
								<th>Logo</th>
								<th>Nombre del producto</th>
								<th>Descripción</th>
								<th>Fecha de liberación</th>
								<th>Fecha de reestructuración</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{filteredProducts.slice(0, resultsPerPage).map((product) => (
								<tr key={product.id}>
									<td>
										<div className={Rules.logo}>{product.logo}</div>
									</td>
									<td>{product.name}</td>
									<td>{product.description}</td>
									<td>{product.releaseDate}</td>
									<td>{product.restructureDate}</td>
									<td>
										<KebabVertical onClick={handleOpenModal} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className={Rules.tableFooter}>
					<span>{filteredProducts.length} Resultados</span>
					<select value={resultsPerPage} onChange={(e) => setResultsPerPage(Number(e.target.value))}>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
					</select>
				</div>
			</div>
			{isModalOpen && <Modal title="tu_producto" onCancel={handleCloseModal} onConfirm={handleConfirm} />}
		</React.Fragment>
	);
};

export function KebabVertical(props: SVGProps<SVGSVGElement>): JSX.Element {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" {...props}>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="3"
				d="M12 12h.01v.01H12zm0-7h.01v.01H12zm0 14h.01v.01H12z"
			/>
		</svg>
	);
}
