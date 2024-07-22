import React from 'react';

import Rules from './styles.module.scss';

export const RegisterForm = (): JSX.Element => {
	const [id, setId] = React.useState('');
	const [nombre, setNombre] = React.useState('Tarjeta Crédito');
	const [descripcion, setDescripcion] = React.useState('');
	const [logo, setLogo] = React.useState('');
	const [fechaLiberacion, setFechaLiberacion] = React.useState('2023-02-22');
	const [fechaRevision] = React.useState('2024-02-22');

	const handleSubmit = (e: React.FormEvent): void => {
		e.preventDefault();
		// handle form submission
	};

	const handleReset = (): void => {
		setId('');
		setDescripcion('');
		setLogo('');
	};

	return (
		<div className={Rules.container}>
			<h1 className={Rules.title}>Formulario de Registro</h1>
			<hr />
			<form className={Rules.form} onSubmit={handleSubmit}>
				<div className={Rules.formGroup}>
					<label htmlFor="id">ID</label>
					<input
						type="text"
						id="id"
						value={id}
						onChange={(e) => setId(e.target.value)}
						className={!id ? Rules.invalid : ''}
					/>
					{!id && <span className={Rules.error}>ID no válido!</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="nombre">Nombre</label>
					<input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="descripcion">Descripción</label>
					<input
						type="text"
						id="descripcion"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						className={!descripcion ? Rules.invalid : ''}
					/>
					{!descripcion && <span className={Rules.error}>Este campo es requerido!</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="logo">Logo</label>
					<input
						type="text"
						id="logo"
						value={logo}
						onChange={(e) => setLogo(e.target.value)}
						className={!logo ? Rules.invalid : ''}
					/>
					{!logo && <span className={Rules.error}>Este campo es requerido!</span>}
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="fechaLiberacion">Fecha Liberación</label>
					<input
						type="date"
						id="fechaLiberacion"
						value={fechaLiberacion}
						onChange={(e) => setFechaLiberacion(e.target.value)}
					/>
				</div>

				<div className={Rules.formGroup}>
					<label htmlFor="fechaRevision">Fecha Revisión</label>
					<input type="date" id="fechaRevision" value={fechaRevision} readOnly />
				</div>

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
};
