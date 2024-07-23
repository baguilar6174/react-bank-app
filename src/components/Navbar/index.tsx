import { Link } from 'react-router-dom';
import Rules from './styles.module.scss';

export const Navbar = (): JSX.Element => {
	return (
		<nav className={Rules.navbar}>
			<Link className={Rules.logo} to="/">
				Bank App
			</Link>
		</nav>
	);
};
