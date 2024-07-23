import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/home.page';
import FormPage from './pages/form.page';
import { Navbar } from './components/Navbar';

function App(): JSX.Element {
	return (
		<Router>
			<div>
				<Navbar />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/form" element={<FormPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
