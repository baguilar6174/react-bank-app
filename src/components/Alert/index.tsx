import React from 'react';
import Rules from './styles.module.scss';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
	type: AlertType;
	message: string;
	onClose?: () => void;
	autoCloseTime?: number;
}

export const Alert: React.FC<AlertProps> = (props: AlertProps): JSX.Element | null => {
	const { type, message, onClose, autoCloseTime = 3000 } = props;

	const [isVisible, setIsVisible] = React.useState(true);

	React.useEffect(() => {
		let timer: NodeJS.Timeout;
		if (autoCloseTime && autoCloseTime > 0) {
			timer = setTimeout(() => {
				handleClose();
			}, autoCloseTime);
		}
		return (): void => {
			if (timer) clearTimeout(timer);
		};
	}, [autoCloseTime]);

	if (!isVisible) return null;

	return (
		<div className={`${Rules.alert} ${Rules[type]}`}>
			<small className={Rules.message}>{message}</small>
			<button className={Rules.closeButton} onClick={handleClose}>
				&times;
			</button>
		</div>
	);

	function handleClose(): void {
		setIsVisible(false);
		if (onClose) onClose();
	}
};
