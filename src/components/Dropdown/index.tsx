/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import Rules from './styles.module.scss';
import { KebabVertical } from '../icons';

interface DropdownProps {
	isOpen: boolean;
	toggleDropdown: () => void;
	handleEdit: () => void;
	handleRemove: () => void;
}

export const Dropdown: React.FC<DropdownProps> = (props: DropdownProps): JSX.Element => {
	const { isOpen, toggleDropdown, handleEdit, handleRemove } = props;

	return (
		<div className={Rules.dropdown}>
			<KebabVertical onClick={toggleDropdown} className={Rules.toggle} />
			{isOpen && (
				<ul className={Rules.menu}>
					<li className={Rules.item} onClick={() => onEdit()}>
						Editar
					</li>
					<li className={Rules.item} onClick={() => onRemove()}>
						Eliminar
					</li>
				</ul>
			)}
		</div>
	);

	function onEdit(): void {
		handleEdit();
		toggleDropdown();
	}

	function onRemove(): void {
		handleRemove();
		toggleDropdown();
	}
};
