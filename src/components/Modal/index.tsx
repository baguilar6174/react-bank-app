import React from 'react';

import Rules from './styles.module.scss';

interface ModalProps {
	title: string;
	onCancel: () => void;
	onConfirm: () => void;
}

export const Modal: React.FC<ModalProps> = (props: ModalProps): JSX.Element => {
	const { title, onCancel, onConfirm } = props;

	return (
		<div className={Rules.modalOverlay}>
			<div className={Rules.modal}>
				<div className={Rules.modalContent}>
					<p>¿Estás seguro de eliminar el producto {title}?</p>
				</div>
				<hr />
				<div className={Rules.modalActions}>
					<button className={Rules.cancelButton} onClick={onCancel}>
						Cancelar
					</button>
					<button className={Rules.confirmButton} onClick={onConfirm}>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
};
