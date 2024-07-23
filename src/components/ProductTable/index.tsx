/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import { useNavigate } from 'react-router-dom';

import Rules from './styles.module.scss';
import { Modal } from '../Modal';
import { useProductsStore } from '../../stores';
import { Loader } from '../Loader';
import { formatDate, Product } from '../../core';
import { InfoIcon, KebabVerticalIcon } from '../icons';
import { ImageWithFallback } from '../ImageWithFallback';
import { Alert } from '../Alert';

export const ProductTable = (): JSX.Element => {
	const navigate = useNavigate();

	const isLoading = useProductsStore((state) => state.isLoading);
	const products = useProductsStore((state) => state.products);
	const message = useProductsStore((state) => state.message);

	const getProducts = useProductsStore((state) => state.getProducts);
	const deleteProduct = useProductsStore((state) => state.deleteProduct);

	// Get products from the server
	React.useEffect(() => {
		getProducts();
	}, []);

	const [searchTerm, setSearchTerm] = React.useState<string>('');
	const [resultsPerPage, setResultsPerPage] = React.useState<number>(5);
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
	const [product, setProduct] = React.useState<Product | undefined>(undefined);
	const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
	const [dropdownPosition, setDropdownPosition] = React.useState<{ [key: string]: { top: number; left: number } }>({});

	const isInputDisabled = isLoading || products.length === 0;

	const filteredProducts = products.filter((product) => {
		const searchTermLower = searchTerm.toLowerCase();
		return (
			product.name.toLowerCase().includes(searchTermLower) ||
			product.id.toString().toLowerCase().includes(searchTermLower) ||
			product.description.toLowerCase().includes(searchTermLower)
		);
	});

	if (isLoading) return <Loader />;

	return (
		<React.Fragment>
			<div className={Rules.containerHeader}>
				<div className={Rules.searchContainer}>
					<input
						disabled={isInputDisabled}
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
								<th>
									Descripción <InfoIcon height={'20px'} width={'20px'} />
								</th>
								<th>
									Fecha de liberación <InfoIcon height={'20px'} width={'20px'} />
								</th>
								<th>
									Fecha de reestructuración <InfoIcon height={'20px'} width={'20px'} />
								</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{filteredProducts.slice(0, resultsPerPage).map((product) => (
								<tr key={product.id}>
									<td>
										<ImageWithFallback
											src={product.logo}
											alt={product.name}
											fallbackComponent={() => <FallbackComponent name={product.name} />}
											width={'40px'}
										/>
									</td>
									<td>{product.name}</td>
									<td>{product.description}</td>
									<td>{formatDate(product.date_release.toString())}</td>
									<td>{formatDate(product.date_revision.toString())}</td>
									<td>
										<KebabVerticalIcon onClick={(e) => toggleDropdown(product, e)} />
										{openDropdown === product.id && (
											<ul
												className={Rules.dropdownMenu}
												style={{
													top: dropdownPosition[product.id]?.top,
													left: dropdownPosition[product.id]?.left
												}}
											>
												<li onClick={navigateToForm}>Editar</li>
												<li onClick={handleOpenDeleteModal}>Eliminar</li>
											</ul>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{message && <Alert type="info" message={message} />}
				<div className={Rules.tableFooter}>
					<span>{filteredProducts.length} Resultados</span>
					<select
						disabled={isInputDisabled}
						value={resultsPerPage}
						onChange={(e) => setResultsPerPage(Number(e.target.value))}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
					</select>
				</div>
			</div>
			{isModalOpen && (
				<Modal title={product?.name || ''} onCancel={handleCloseDeleteModal} onConfirm={handleDeleteProduct} />
			)}
		</React.Fragment>
	);

	function FallbackComponent({ name }: { name: string }): JSX.Element {
		return <div className={Rules.logo}>{name.slice(0, 2).toUpperCase()}</div>;
	}

	function toggleDropdown(product: Product, event: React.MouseEvent<SVGSVGElement>): void {
		setProduct(product);
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		setDropdownPosition({
			...dropdownPosition,
			[product.id]: {
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX - 120
			}
		});
		setOpenDropdown((prevId) => (prevId === product.id ? null : product.id));
	}

	function navigateToForm(): void {
		navigate('/form', { state: product });
		setOpenDropdown(null);
	}

	async function handleDeleteProduct(): Promise<void> {
		if (!product) return;
		await deleteProduct(product.id);
		handleCloseDeleteModal();
	}

	function handleOpenDeleteModal(): void {
		setIsModalOpen(true);
		setOpenDropdown(null);
	}

	function handleCloseDeleteModal(): void {
		setProduct(undefined);
		setIsModalOpen(false);
	}
};
