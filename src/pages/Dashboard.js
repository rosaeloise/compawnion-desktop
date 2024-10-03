import React from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar';

class Dashboard extends React.Component {
	render() {
		return (
			<>
				<Sidebar
					avatar='https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.6435-9/98343921_3964488750260462_3832610965619212288_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeGm5O07sV4g2mWQJmqJ1-O-377aGaUqoBLfvtoZpSqgEsD_5TyQ1z8RgL1MZRyaVA-j34PtB1K_aLxqUbhLceQH&_nc_ohc=ki5IaXRBJwcQ7kNvgEkKQkZ&_nc_ht=scontent.fmnl8-1.fna&oh=00_AYAb4j1j4QVfh2vd-O-S1_AsIqj5A9mtV2U15ySydQl4TA&oe=6724C727'
					name='John Doe'
				/>
			</>
		)
	};
};

export default Dashboard;