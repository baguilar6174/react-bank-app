import React from 'react';
import { useNavigate } from 'react-router-dom';

import Rules from './styles.module.scss';
import { Modal } from '../Modal';
import { useProductsStore } from '../../stores';
import { Loader } from '../Loader';
import { formatDate, Product } from '../../core';
import { Dropdown } from '../Dropdown';

export const ProductTable = (): JSX.Element => {
	const navigate = useNavigate();

	const isLoading = useProductsStore((state) => state.isLoading);
	const products = useProductsStore((state) => state.products);
	const message = useProductsStore((state) => state.message);

	const getProducts = useProductsStore((state) => state.getProducts);
	const deleteProduct = useProductsStore((state) => state.deleteProduct);

	React.useEffect(() => {
		getProducts();
	}, []);

	const [searchTerm, setSearchTerm] = React.useState<string>('');
	const [resultsPerPage, setResultsPerPage] = React.useState<number>(5);
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
	const [product, setProduct] = React.useState<Product | undefined>(undefined);

	const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

	if (isLoading) return <Loader />;

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
					<button className={Rules.submit} onClick={navigateToForm}>
						Agregar
					</button>
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
									<td>{formatDate(product.date_release.toString())}</td>
									<td>{formatDate(product.date_revision.toString())}</td>
									<td>
										<Dropdown
											isOpen={isDropdownOpen}
											toggleDropdown={() => toggleDropdown(product)}
											handleRemove={handleOpenModal}
											handleEdit={navigateToForm}
										/>
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
				{message && <span>{message}</span>}
			</div>
			{isModalOpen && <Modal title={product?.name || ''} onCancel={handleCloseModal} onConfirm={handleConfirm} />}
		</React.Fragment>
	);

	function navigateToForm(): void {
		navigate('/form');
	}

	function toggleDropdown(product: Product): void {
		setProduct(product);
		setIsDropdownOpen(!isDropdownOpen);
	}

	async function handleConfirm(): Promise<void> {
		if (!product) return;
		await deleteProduct(product.id);
		handleCloseModal();
	}

	function handleOpenModal(): void {
		setIsModalOpen(true);
	}

	function handleCloseModal(): void {
		setProduct(undefined);
		setIsModalOpen(false);
	}
};
