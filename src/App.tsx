import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/home.page';
import FormPage from './pages/form.page';

function App(): JSX.Element {
	return (
		<Router>
			<div>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/form" element={<FormPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
