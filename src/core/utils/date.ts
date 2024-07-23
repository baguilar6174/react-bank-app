export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();
	return `${day}/${month}/${year}`;
};

export const convertDateToString = (date: Date): string => {
	return date.toISOString().split('T')[0]; // Convertir a 'YYYY-MM-DD'
};
