/* eslint-disable camelcase */
import { z } from 'zod';
// import { API } from '../../core';

export const schema = z
	.object({
		id: z
			.string({ required_error: 'ID es requerido' })
			.min(3, 'ID debe tener al menos 3 caracteres')
			.max(10, 'ID no puede tener más de 10 caracteres'),
		name: z
			.string({ required_error: 'Nombre es requerido' })
			.min(5, 'Nombre debe tener al menos 5 caracteres')
			.max(100, 'Nombre no puede tener más de 100 caracteres'),
		description: z
			.string({ required_error: 'Descripción es requerida' })
			.min(10, 'Descripción debe tener al menos 10 caracteres')
			.max(200, 'Descripción no puede tener más de 200 caracteres'),
		logo: z.string({ required_error: 'Logo es requerido' }).url('Debe ser una URL válida'),
		date_release: z.string({ required_error: 'Fecha de Liberación es requerida' }),
		date_revision: z.string({ required_error: 'Fecha de Revisión es requerida' })
	})
	.refine(
		(data) => {
			const date_release = new Date(data.date_release);
			return new Date(date_release) >= new Date();
		},
		{
			message: 'Fecha de Liberación debe ser igual o mayor a la fecha actual',
			path: ['date_release']
		}
	)
	.refine(
		(data) => {
			const date_release = new Date(data.date_release);
			const date_revision = new Date(data.date_revision);
			date_release.setFullYear(date_release.getFullYear() + 1);
			return date_release.toDateString() === date_revision.toDateString();
		},
		{
			message: 'Fecha de Revisión debe ser exactamente un año posterior a la fecha de liberación',
			path: ['date_revision']
		}
	);

export type ProductFormData = z.infer<typeof schema>;
