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

class App extends
	React.Component {
	render() {
		return (
			<HashRouter>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/dashboard' element={<Dashboard />} />
				</Routes>
			</HashRouter>
		);
	};
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);