import React, { SVGProps } from 'react';

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
