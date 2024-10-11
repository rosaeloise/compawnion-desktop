import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
	HashRouter,
	Route,
	Routes
} from 'react-router-dom';

import './css/global.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rescues from './pages/Rescues';
import Applications from './pages/Applications';
import Compawnions from './pages/Compawnions';

class App extends
	React.Component {
	render() {
		return (
			<HashRouter>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/login' element={<Login />} />

					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/rescues' element={<Rescues />} />
					<Route path='/applications' element={<Applications />} />
					<Route path='/compawnions' element={<Compawnions />} />
				</Routes>
			</HashRouter>
		);
	};
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);