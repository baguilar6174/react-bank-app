/* eslint-disable camelcase */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Rules from './styles.module.scss';
import { ProductFormData, schema } from './schema';
import { useProductsStore } from '../../stores';
import { Loader } from '../Loader';
import React from 'react';

export const RegisterForm = (): JSX.Element => {
	const createProduct = useProductsStore((state) => state.createProduct);
	const verifyProductId = useProductsStore((state) => state.verifyProductId);

	const isLoading = useProductsStore((state) => state.isLoading);
	const error = useProductsStore((state) => state.error);
	const isValidId = useProductsStore((state) => state.isValidId);

	const form = useForm<ProductFormData>({ resolver: zodResolver(schema) });

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError
	} = form;

	const onSubmitPrev = React.useCallback(
		async (data: ProductFormData) => {
			if (!(await checkValidId(data))) return;
			onSubmit(data);
		},
		[checkValidId, onSubmit]
	);

	if (isLoading) return <Loader />;

	return (
		<div className={Rules.container}>
			<h1 className={Rules.title}>Formulario de Registro</h1>
			<hr />
			<form className={Rules.form} onSubmit={handleSubmit(onSubmitPrev)}>
				<div className={Rules.formGroup}>
					<label htmlFor="id">ID</label>
					<input type="text" {...register('id')} className={errors.id ? Rules.invalid : ''} />
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
						<p>{error.message}</p>
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

	async function checkValidId(data: ProductFormData): Promise<boolean> {
		await verifyProductId(data.id);
		if (isValidId) {
			setError('id', { type: 'validate', message: 'El ID ya existe' });
			return false;
		}
		return true;
	}

	async function onSubmit(data: ProductFormData): Promise<void> {
		await createProduct(data);
	}

	function handleReset(): void {
		reset();
	}
};
