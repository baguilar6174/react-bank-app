/* eslint-disable camelcase */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';

import Rules from './styles.module.scss';
import { ProductFormData, schema } from './schema';
import { useProductsStore } from '../../stores';
import { Loader } from '../Loader';
import { convertDateToString, Product } from '../../core';
import { Alert } from '../Alert';

export const RegisterForm = (): JSX.Element => {
	const location = useLocation();
	const navigate = useNavigate();

	const createProduct = useProductsStore((state) => state.createProduct);
	const updateProduct = useProductsStore((state) => state.updateProduct);

	const isLoading = useProductsStore((state) => state.isLoading);
	const error = useProductsStore((state) => state.error);
	const updatedProduct = useProductsStore((state) => state.updatedProduct);

	const form = useForm<ProductFormData>({ resolver: zodResolver(schema) });

	const product = location.state as Product | undefined;

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		setError
	} = form;

	// Set error message when the product ID already exists
	React.useEffect(() => {
		if (error?.name === 'ProductIdAlreadyExists') {
			setError('id', { type: 'validate', message: 'El ID ya existe' });
			return;
		}
	}, [error]);

	// Set the initial values of the form when the product is loaded
	React.useEffect(() => {
		if (!product) return;
		setValue('id', product.id);
		setValue('name', product.name);
		setValue('description', product.description);
		setValue('logo', product.logo);
		setValue('date_release', convertDateToString(new Date(product.date_release)));
		setValue('date_revision', convertDateToString(new Date(product.date_revision)));
	}, []);

	// Redirect to the home page when the product is created
	React.useEffect(() => {
		if (updatedProduct) {
			handleReset();
			navigate('/');
		}
	}, [updatedProduct]);

	if (isLoading) return <Loader />;

	return (
		<div className={Rules.container}>
			<h1 className={Rules.title}>Formulario de {product ? 'Edición' : 'Registro'}</h1>
			<hr />
			<form className={Rules.form} onSubmit={handleSubmit(onSubmit)}>
				<div className={Rules.formGroup}>
					<label htmlFor="id">ID</label>
					<input
						type="text"
						disabled={Boolean(product)}
						{...register('id')}
						className={errors.id ? Rules.invalid : ''}
					/>
					{errors.id && <span className={Rules.error}>{errors.id.message}</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="nombre">Nombre</label>
					<input type="text" {...register('name')} className={errors.name ? Rules.invalid : ''} />
					{errors.name && <span className={Rules.error}>{errors.name.message}</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="descripcion">Descripción</label>
					<input
						type="text"
						id="descripcion"
						{...register('description')}
						className={errors.description ? Rules.invalid : ''}
					/>
					{errors.description && <span className={Rules.error}>{errors.description.message}</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="logo">Logo</label>
					<input type="text" id="logo" {...register('logo')} className={errors.logo ? Rules.invalid : ''} />
					{errors.logo && <span className={Rules.error}>{errors.logo.message}</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="fechaLiberacion">Fecha Liberación</label>
					<input type="date" {...register('date_release')} className={errors.date_release ? Rules.invalid : ''} />
					{errors.date_release && <span className={Rules.error}>{errors.date_release.message}</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="fechaRevision">Fecha Revisión</label>
					<input type="date" {...register('date_revision')} />
					{errors.date_revision && <span className={Rules.error}>{errors.date_revision.message}</span>}
				</div>

				{error && (
					<div className={Rules.error}>
						<Alert type="error" message={error.message} />
						{error.constraints?.map((constraint, index) => <p key={index}>{constraint}</p>)}
					</div>
				)}
				<div className={Rules.buttons}>
					<button type="button" onClick={handleReset} className={Rules.reset}>
						Reiniciar
					</button>
					<button type="submit" className={Rules.submit}>
						Enviar
					</button>
				</div>
			</form>
		</div>
	);

	async function onSubmit(data: ProductFormData): Promise<void> {
		if (product) {
			await updateProduct(product.id, data);
			return;
		}
		await createProduct(data);
	}

	function handleReset(): void {
		reset();
	}
};
