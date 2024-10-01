import * as React from 'react';
import * as ReactClient from 'react-dom/client';
import {
	createHashRouter,
	RouterProvider
} from 'react-router-dom';

import './css/global.css';

import Login from './pages/Login';

const router = createHashRouter([
	{
		path: '/',
		element: <Login />,
		loader: () => import('./pages/Login')
	}
]);

ReactClient.createRoot(document.getElementById('root')).render(
	<RouterProvider router={router} />
);