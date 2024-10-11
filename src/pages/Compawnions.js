import React from 'react';

import Sidebar from '../components/Sidebar';

import '../css/applications.css';

class Compawnions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: {
					first: '',
					last: ''
				},
				role: '',
				username: ''
			}
		};
	};
	componentDidMount() {
		setTimeout(() => {
			this.setState({
				loading: false,
				user: {
					avatar: 'https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.6435-9/98343921_3964488750260462_3832610965619212288_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeGm5O07sV4g2mWQJmqJ1-O-377aGaUqoBLfvtoZpSqgEsD_5TyQ1z8RgL1MZRyaVA-j34PtB1K_aLxqUbhLceQH&_nc_ohc=ki5IaXRBJwcQ7kNvgEkKQkZ&_nc_ht=scontent.fmnl8-1.fna&oh=00_AYAb4j1j4QVfh2vd-O-S1_AsIqj5A9mtV2U15ySydQl4TA&oe=6724C727',
					name: {
						first: 'Gumoan',
						last: 'Magsaysay'
					},
					role: 'Administrator',
					username: 'gumoan'
				}
			});
		}, 1000);
	};
	render() {
		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name.first + ' ' + this.state.user.name.last}
					role={this.state.user.role}

					active='compawnions'
				/>
			</>
		)
	};
};

export default Compawnions;