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
import AddRescuedPet from './pages/AddRescuedPet';
import RescuedInfo from './pages/RescuedInfo';
import Applications from './pages/Applications';
import AppDetails from './pages/AppDetails';
import Compawnions from './pages/Compawnions';
import CompawnionInfo from './pages/CompawnionInfo';

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
					<Route path='/rescues/add' element={<AddRescuedPet />} />
					<Route path='/rescues/:id' element={<RescuedInfo />} />

					<Route path='/applications' element={<Applications />} />
					<Route path='/applications/:id' element={<AppDetails />} />

					<Route path='/compawnions' element={<Compawnions />} />
					<Route path='/compawnions/:id' element={<CompawnionInfo />} />
				</Routes>
			</HashRouter>
		);
	};
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);