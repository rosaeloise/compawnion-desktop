import React from 'react';

import Sidebar from '../components/Sidebar';

import '../css/rescues.css';

class Applications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: '',
				role: '',
				username: ''
			},
		};
	};
	componentDidMount() {
		fetch('http://localhost:3000/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					user: {
						avatar: res.aStaffInfo.Picture,
						name: res.aStaffInfo.Name,
						role: res.aStaffInfo.Branches,
						username: res.aStaffInfo.Username
					}
				});
			});
	};
	render() {
		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					role={this.state.user.role}

					active='applications'
				/>
			</>
		)
	};
};

export default Applications;